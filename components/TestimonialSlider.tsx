'use client';

import { useState } from 'react';
import FloatingSilhouettes from './FloatingSilhouettes';

import { testimonials } from '@/content/testimonials';

export default function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const testimonial = testimonials[active];
  const move = (direction: number) => setActive((active + direction + testimonials.length) % testimonials.length);

  return <section className="testimonial-slider testimonial" aria-labelledby="client-testimonials-title"><FloatingSilhouettes/><div className="container"><div className="testimonial-slider-heading"><p className="eyebrow">CLIENT TESTIMONIALS</p><h2 id="client-testimonials-title">What clients<br/><span>have to say.</span></h2></div><div className="testimonial-slider-layout"><span className="quote-mark" aria-hidden="true">“</span><figure aria-live="polite"><blockquote cite="https://catchthebeat.ca/">{testimonial.quote}</blockquote><figcaption><strong>{testimonial.name}</strong>{testimonial.role && <span>{testimonial.role}</span>}</figcaption></figure></div><div className="testimonial-slider-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous testimonial">←</button><span>{String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span><button type="button" onClick={() => move(1)} aria-label="Next testimonial">→</button></div></div></section>;
}
