'use client';

import { Icon } from '@/components/AIIcon';
import { useRef, useState, type FormEvent } from 'react';
import { business } from '@/content/site';
import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const requestId = useRef<string | null>(null);
  const sending = useRef(false);

  async function sendEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    for (const key of ['name', 'email', 'phone', 'message']) {
      const field = form.elements.namedItem(key) as HTMLInputElement | HTMLTextAreaElement;
      field.setCustomValidity(String(data.get(key) || '').trim() ? '' : 'Please complete this field.');
    }
    if (!form.reportValidity()) return;
    const value = (key: string) => String(data.get(key) || '').trim();
    sending.current = true;
    setStatus('sending');
    setError('');
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: value('name'), email: value('email'), organisation: value('organisation'), phone: value('phone'), subject: value('subject'), message: value('message'), website: value('website'), requestId: requestId.current }),
        signal: AbortSignal.timeout(60000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setStatus('error');
        setError(typeof result.error === 'string' ? result.error : 'Your message could not be sent. Please try again.');
        return;
      }
      setStatus('sent');
      form.reset();
      requestId.current = null;
    } catch {
      setStatus('error');
      setError('We couldn’t confirm your message was sent. Please try again.');
    } finally {
      sending.current = false;
    }
  }

  return <div className={styles.panel}>
    <p className="eyebrow">GET IN TOUCH</p>
    <h2>What’s on your mind?</h2>
    <p className={styles.intro}>Share a little about your team and what you’d like help with.</p>
    <form onSubmit={sendEmail} onInput={event => {
      const field = event.target as HTMLInputElement | HTMLTextAreaElement;
      field.setCustomValidity?.('');
      setStatus('idle');
      setError('');
      requestId.current = null;
    }} aria-label="Contact enquiry" aria-describedby="contact-form-note" aria-busy={status === 'sending'}>
      <p className={styles.requiredNote}>Fields marked * are required.</p>
      <fieldset className={styles.fields} disabled={status === 'sending'}>
        <div className={styles.honeypot} aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off"/></div>
        <div className={styles.field}><input id="contact-name" name="name" autoComplete="name" placeholder=" " required maxLength={100}/><label htmlFor="contact-name">Your name *</label></div>
        <div className={styles.field}><input id="contact-email" name="email" type="email" autoComplete="email" placeholder=" " required maxLength={180}/><label htmlFor="contact-email">Email address *</label></div>
        <div className={styles.field}><input id="contact-organisation" name="organisation" autoComplete="organization" placeholder=" " maxLength={150}/><label htmlFor="contact-organisation">Organisation</label></div>
        <div className={styles.field}><input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder=" " required maxLength={40}/><label htmlFor="contact-phone">Phone number *</label></div>
        <div className={`${styles.field} ${styles.full}`}><input id="contact-subject" name="subject" placeholder=" " maxLength={150}/><label htmlFor="contact-subject">Subject</label></div>
        <div className={`${styles.field} ${styles.full}`}><textarea id="contact-message" name="message" placeholder=" " rows={6} required maxLength={1800}/><label htmlFor="contact-message">Your enquiry *</label></div>
      </fieldset>
      <p className={styles.note} id="contact-form-note">For email enquiries, contact <a href={business.emailLink}>{business.email}</a>.</p>
      <button className={styles.submit} type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'} <Icon type="send" size={21}/></button>
      {status === 'sent' && <div className={styles.feedback} role="status"><strong>Thank you for getting in touch.</strong> Your message has been sent to {business.email}.</div>}
      {status === 'error' && <div className={`${styles.feedback} ${styles.error}`} role="alert"><p>{error}</p><a href={business.emailLink}>Email {business.email}</a></div>}
    </form>
  </div>;
}
