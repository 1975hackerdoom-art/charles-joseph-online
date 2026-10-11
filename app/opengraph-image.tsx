import { ImageResponse } from 'next/og';
export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ background: '#18382e', color: '#ffffff', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '70px 80px', borderBottom: '12px solid #c6a66b' }}><div style={{ color: '#c6a66b', fontSize: 26, letterSpacing: 4 }}>CHARLES JOSEPH</div><div style={{ fontSize: 76, lineHeight: 1.1, marginTop: 65, maxWidth: 950 }}>Faith. Leadership. Enterprise.</div><div style={{ color: '#c6a66b', fontSize: 29, marginTop: 48 }}>Practical wisdom for life, leadership and business.</div></div>, size);
}
