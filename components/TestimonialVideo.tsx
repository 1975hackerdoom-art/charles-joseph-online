const videos = [
  ['HhaPySxVsIQ?start=2', 'Duncan Malkinson Testimonial - Corporate Officer CCRD'],
  ['F_f5DvySL94', 'Ryan Niche Testimonial - Burns Lake CAO'],
  ['SF461M7AQYs', 'ABC|BNB Testimonial'],
  ['vW1rXZeOu4M', 'David Braddy ActionCoach Testimonial'],
  ['ziNhKitAQBg', 'CardioDanceBabes Testimonials'],
  ['JNR_qy79cNM', 'JR Burgess - Healthovators Testimonial'],
  ['B32Y1E12Rlw', 'Annie McCaughey - Immigration Station Canada'],
  ['ocwv-mvjmbk?start=3', 'Cindy Combs Testimonial Interview'],
  ['pTY9FPZMxdg', "Smitty's Testimonial"],
  ['96hYeL_qV2o?start=5', 'Dai Fukusaku Testimonial'],
  ['Hh23HLJJQUY', 'Bioponix Testimonial'],
  ['Tm9BCkQ3pXg?start=2', 'Suzanne Scarrow Testimonial'],
];

export default function TestimonialVideo() {
  return <section className="testimonial-video" aria-labelledby="testimonial-video-title"><div className="container"><div className="testimonial-video-heading"><div><p className="eyebrow">HEAR IT FROM CLIENTS</p><h2 id="testimonial-video-title">Real work.<br/><span>Real perspective.</span></h2></div><p>Stories from clients who have worked with Catch the Beat across strategy, marketing and digital transformation.</p></div><div className="testimonial-video-grid">{videos.map(([id, title]) => <article className="video-card" key={id}><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${id}`} title={title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><h3>{title}</h3><a href={`https://www.youtube.com/watch?v=${id.split('?')[0]}`} className="video-link">Watch video <span aria-hidden="true">↗</span></a></article>)}</div></div></section>;
}
