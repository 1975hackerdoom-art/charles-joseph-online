# Charles Joseph form setup

All four Charles Joseph forms post to `/api/forms`:

- General newsletter signup
- Property-guide request
- Mentorship interest
- Contact enquiry

Configure these server-side environment variables in the hosting project before launch:

```text
FORM_RECIPIENT_EMAIL=the monitored Charles Joseph inbox
SMTP_HOST=the authenticated SMTP host
SMTP_PORT=587
SMTP_USER=the SMTP username
SMTP_PASSWORD=the SMTP password
SMTP_FROM=an authorised sending address on the domain
SMTP_SECURE=false
```

The property form always emails the requested guide link to the visitor. Its optional consent checkbox is reported separately and does not gate guide access. Newsletter consent is required. Contact and mentorship enquiries do not subscribe visitors to marketing emails.

Do not commit SMTP credentials or expose them as `NEXT_PUBLIC_` variables. Before the main-domain launch, verify delivery to the monitored inbox, reply-to behaviour, the guide link, invalid-email errors, honeypot spam rejection and the consent wording.
