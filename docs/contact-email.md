# Direct contact email delivery

The contact form posts to `/api/contact`. The server validates the enquiry and
sends it directly through SMTP to **digital@catchthebeat.ca** using Nodemailer.
There is no WordPress or Contact Form 7 connection.

The footer's Request a Quote form uses the same endpoint with `kind: "quote"`.
It requires only Email and Message, sets the subject to `Website quote request`,
and uses the visitor's email as Reply-To. The full contact form still requires
name and phone. Both forms retain their entries on failure and report success
only after SMTP accepts the message.

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM`
in the hosting platform's server environment. For local development, copy
`.env.example` to `.env.local`, fill in the provider's settings, and restart Next.js.
Do not commit credentials or expose them using NEXT_PUBLIC_ variables.

Use a sender address authorized by the SMTP provider. `SMTP_FROM` defaults to
digital@catchthebeat.ca. Port 587 requires STARTTLS; port 465 uses immediate TLS.
Replies go to the visitor's submitted email address. The recipient is fixed on
the server and cannot be changed by the visitor.

Until SMTP credentials are configured, submission returns an unavailable message
with a direct email link. Success is shown only after SMTP accepts the recipient;
acceptance does not guarantee final inbox placement. Verify delivery after setup.

Run `node scripts/check-contact-email.cjs` for mocked delivery checks. No real
emails are sent by these checks. Rate limits and duplicate detection are local to
each server instance; production hosting should also apply request rate limits.

Transport reference: https://nodemailer.com/smtp
