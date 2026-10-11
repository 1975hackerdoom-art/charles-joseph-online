import NewsletterButton from './NewsletterButton';
import FloatingSilhouettes from './FloatingSilhouettes';
import Link from 'next/link';
import { navigation } from '@/content/site';
import QuoteForm from './QuoteForm';
export default function Footer() {
  return <footer><FloatingSilhouettes/><div className="container"><div className="footer-main"><div><Link href="/" className="brand" aria-label="Catch the Beat home"><img src="/images/ctb-logo.webp" width="49" height="49" alt=""/><span>CATCH THE BEAT</span></Link><p>Practical AI. Confident people.<br/>Stronger communities.</p><div className="footer-newsletter"><NewsletterButton/></div></div><nav aria-label="Footer navigation">{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><QuoteForm/></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Catch the Beat. All rights reserved.</span><a href="#top">Back to top <span aria-hidden="true">↑</span></a></div></div></footer>;
}
