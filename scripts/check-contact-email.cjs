const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { randomUUID } = require('node:crypto');

const source = fs.readFileSync('app/api/contact/route.ts', 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const exportsObject = {};
let calls = 0;
let delivery = 'accepted';
let smtpOptions;
const env = { SMTP_HOST: 'smtp.example.com', SMTP_USER: 'test', SMTP_PASSWORD: 'mock-password' };
let upstreamBody;
const context = {
  exports: exportsObject,
  require: name => name === 'nodemailer' ? {
    createTransport: options => {
      smtpOptions = options;
      return { sendMail: async message => {
        calls++;
        upstreamBody = message;
        if (delivery === 'error') throw new Error('Mock SMTP failure');
        return { accepted: delivery === 'accepted' ? ['digital@catchthebeat.ca'] : [] };
      } };
    },
  } : require(name),
  Request, Response, Buffer, URL,
  process: { env },
  fetch: () => { throw new Error('No HTTP or WordPress calls are permitted'); },
};
vm.runInNewContext(output, context);
const payload = () => ({ name: 'Test Example', email: 'test@example.com', phone: '+1 250 555 0100', organisation: 'Test municipality', subject: 'Website test', message: 'A mocked enquiry, never sent.', website: '', requestId: randomUUID() });
const send = (data, origin = 'http://localhost:3000') => exportsObject.POST(new Request('http://localhost:3000/api/contact', { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(data) }));
(async () => {
  assert.equal((await send({ ...payload(), email: 'invalid' })).status, 400);
  assert.equal((await send({ ...payload(), phone: '' })).status, 400);
  assert.equal((await send({ ...payload(), website: 'spam.example' })).status, 400);
  assert.equal((await send({ ...payload(), message: 'x'.repeat(1801) })).status, 400);
  assert.equal((await send(payload(), 'https://another-site.example')).status, 403);
  assert.equal(calls, 0);
  delete env.SMTP_PASSWORD;
  assert.equal((await send(payload())).status, 503);
  assert.equal(calls, 0);
  env.SMTP_PASSWORD = 'mock-password';
  delivery = 'error';
  assert.equal((await send(payload())).status, 502);
  delivery = 'rejected';
  assert.equal((await send(payload())).status, 502);
  delivery = 'accepted';
  const valid = { ...payload(), to: 'unwanted@example.com', from: 'unwanted@example.com' };
  assert.equal((await send(valid)).status, 200);
  assert.equal(upstreamBody.to, 'digital@catchthebeat.ca');
  assert.equal(upstreamBody.from.address, 'digital@catchthebeat.ca');
  assert.equal(upstreamBody.replyTo.address, valid.email);
  assert.ok(upstreamBody.text.includes(valid.phone));
  assert.ok(upstreamBody.text.includes(valid.organisation));
  assert.ok(upstreamBody.text.includes(valid.message));
  assert.equal(upstreamBody.subject, 'Website enquiry: Website test');
  assert.equal(smtpOptions.port, 587);
  assert.equal(smtpOptions.secure, false);
  assert.equal(smtpOptions.requireTLS, true);
  const before = calls;
  assert.equal((await send(valid)).status, 200);
  assert.equal(calls, before);
  assert.equal((await send({ ...valid, message: 'Different message' })).status, 409);
  env.SMTP_PORT = '465';
  assert.equal((await send({ ...payload(), email: 'another@example.com' })).status, 200);
  assert.equal(smtpOptions.secure, true);
  assert.equal((await send({ ...payload(), name: 'Name\r\nBcc: other@example.com' })).status, 400);
  const quote = { kind: 'quote', email: 'quote@example.com', message: 'Please quote for a workshop.', requestId: randomUUID() };
  assert.equal((await send({ ...quote, message: '  ' })).status, 400);
  assert.equal((await send({ ...quote, email: 'bad' })).status, 400);
  assert.equal((await send({ ...quote, kind: 'unknown' })).status, 400);
  assert.equal((await send(quote)).status, 200);
  assert.equal(upstreamBody.to, 'digital@catchthebeat.ca');
  assert.equal(upstreamBody.replyTo.address, quote.email);
  assert.equal(upstreamBody.subject, 'Website quote request');
  assert.ok(upstreamBody.text.includes(quote.message));
  const quoteCalls = calls;
  assert.equal((await send(quote)).status, 200);
  assert.equal(calls, quoteCalls);
  delete env.SMTP_PASSWORD;
  assert.equal((await send({ ...quote, requestId: randomUUID() })).status, 503);
  console.log('PASS contact and quote validation, fixed recipient, reply-to, TLS, missing credentials, SMTP failure/rejection, success and duplicate handling. No emails sent.');
})().catch(error => { console.error(error); process.exit(1); });
