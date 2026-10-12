import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

type FormKind = 'newsletter' | 'property-guide' | 'mentorship' | 'contact';

const GUIDE_URL = 'https://charlesjosephonline.com/Before_You_Buy_Back_Home.pdf';

function clean(value: unknown, max = 2000) { return String(value ?? '').trim().slice(0, max); }
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] ?? char)); }
function validEmail(value: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

function getMailer() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;
  const recipient = process.env.FORM_RECIPIENT_EMAIL;
  if (!host || !user || !password || !from || !recipient) return null;
  return { recipient, from, transporter: nodemailer.createTransport({ host, port: Number(process.env.SMTP_PORT ?? 587), secure: process.env.SMTP_SECURE === 'true', auth: { user, pass: password } }) };
}

function fieldsFor(kind: FormKind, data: Record<string, unknown>) {
  const email = clean(data.email, 180);
  if (!validEmail(email)) throw new Error('Please enter a valid email address.');
  if (kind === 'newsletter' && data.consent !== true) throw new Error('Please confirm that you would like to receive emails.');
  if (kind === 'contact' && !clean(data.message)) throw new Error('Please enter your message.');
  if (kind === 'mentorship' && !clean(data.firstName)) throw new Error('Please enter your first name.');
  return { ...data, email, firstName: clean(data.firstName, 100), name: clean(data.name, 100), message: clean(data.message), country: clean(data.country, 100), question: clean(data.question), enquiryType: clean(data.enquiryType, 80), interests: Array.isArray(data.interests) ? data.interests.map((item) => clean(item, 60)).slice(0, 5) : [] };
}

function messageFor(kind: FormKind, data: ReturnType<typeof fieldsFor>) {
  const title = { newsletter: 'New general newsletter request', 'property-guide': 'New property guide request', mentorship: 'New mentorship interest', contact: 'New contact enquiry' }[kind];
  const rows = Object.entries(data).filter(([, value]) => value !== '' && value !== undefined && !(Array.isArray(value) && value.length === 0)).map(([key, value]) => `<p><strong>${escapeHtml(key)}:</strong> ${escapeHtml(Array.isArray(value) ? value.join(', ') : String(value))}</p>`).join('');
  return { title, html: `<h2>${escapeHtml(title)}</h2>${rows}<p><small>Submitted through charlesjosephonline.com.</small></p>` };
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { kind?: FormKind; data?: Record<string, unknown> };
    const kind = body.kind;
    if (!kind || !['newsletter', 'property-guide', 'mentorship', 'contact'].includes(kind) || !body.data) return NextResponse.json({ ok: false, error: 'We could not process your request. Please try again.' }, { status: 400 });
    if (clean(body.data.website, 20)) return NextResponse.json({ ok: true });
    const data = fieldsFor(kind, body.data);
    const mailer = getMailer();
    if (!mailer) return NextResponse.json({ ok: false, error: 'The form is temporarily unavailable. Please try again later.' }, { status: 503 });
    const message = messageFor(kind, data);
    await mailer.transporter.sendMail({ from: mailer.from, to: mailer.recipient, replyTo: data.email, subject: message.title, html: message.html, text: message.html.replace(/<[^>]+>/g, ' ') });
    if (kind === 'property-guide') {
      await mailer.transporter.sendMail({ from: mailer.from, to: data.email, subject: 'Your free property guide', replyTo: mailer.recipient, html: `<p>Hello ${escapeHtml(data.firstName || 'there')},</p><p>Thank you for requesting my diaspora property guide.</p><p><a href="${GUIDE_URL}">Download your copy here</a>.</p><p>I hope it gives you useful questions to consider as you think about property in Nigeria.</p><p>Best wishes,<br />Dr. Charles Joseph</p>`, text: `Thank you for requesting my diaspora property guide. Download your copy here: ${GUIDE_URL}` });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'We could not process your request. Please try again.';
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
