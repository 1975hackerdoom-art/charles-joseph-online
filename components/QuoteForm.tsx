'use client';

import { useRef, useState, type FormEvent } from 'react';
import { business } from '@/content/site';
import ServiceReveal from './ServiceReveal';
import styles from './QuoteForm.module.css';

export default function QuoteForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const sending = useRef(false);
  const requestId = useRef<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) || '').trim();
    const message = form.elements.namedItem('message') as HTMLTextAreaElement;
    message.setCustomValidity(value('message') ? '' : 'Please enter your message.');
    if (!form.reportValidity()) return;
    sending.current = true;
    setStatus('sending');
    setError('');
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'quote', email: value('email'), message: value('message'), website: value('website'), requestId: requestId.current }),
        signal: AbortSignal.timeout(60000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(typeof result.error === 'string' ? result.error : 'Your request could not be sent. Please try again.');
      setStatus('sent');
      form.reset();
      requestId.current = null;
    } catch (error) {
      setStatus('error');
      setError(error instanceof Error && error.name === 'Error' ? error.message : 'We couldn’t confirm your request was sent. Please try again.');
    } finally { sending.current = false; }
  }

  return <ServiceReveal className={styles.wrapper}><div data-service-reveal>
    <h2 className={styles.heading}>Request a Quote</h2>
    <form className={styles.form} onSubmit={submit} aria-label="Request a Quote" aria-busy={status === 'sending'} onInput={event => {
      (event.target as HTMLInputElement | HTMLTextAreaElement).setCustomValidity?.('');
      requestId.current = null;
      setStatus('idle');
      setError('');
    }}>
      <fieldset disabled={status === 'sending'}>
        <div className={styles.trap} aria-hidden="true"><label htmlFor="quote-website">Leave this empty</label><input id="quote-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <div className={styles.field}><input id="quote-email" name="email" type="email" autoComplete="email" required maxLength={180} placeholder=" " /><label htmlFor="quote-email">Email</label></div>
        <div className={styles.field}><textarea id="quote-message" name="message" rows={4} required maxLength={1800} placeholder=" " /><label htmlFor="quote-message">Message</label></div>
        <button className={styles.submit} type="submit">{status === 'sending' ? 'Sending…' : 'Submit Now'}<span aria-hidden="true">{status === 'sending' ? '…' : '↗'}</span></button>
      </fieldset>
      <div aria-live="polite">{status === 'sent' && <p className={styles.feedback}>Thank you! Your quote request has been sent.</p>}</div>
      {status === 'error' && <div className={styles.feedback} role="alert"><p>{error}</p><a href={`mailto:${business.email}?subject=Request%20a%20Quote`}>Email {business.email}</a></div>}
    </form>
  </div></ServiceReveal>;
}
