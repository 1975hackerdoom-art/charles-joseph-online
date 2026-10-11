'use client';

import { useState } from 'react';
import { Icon, type IconType } from './AIIcon';

const stages = [
  { title: 'Discover', icon: 'discovery', text: "We start with a real conversation about where you are right now. What's working, what's driving everyone crazy, and what you wish you could change." },
  { title: 'Team Workshop', icon: 'training', text: "I come in and spend 2 hours with your team and staff to introduce everyone to AI in a friendly, no-pressure way. We'll explore what AI can and can't do, address any concerns, and get everyone on the same page before we dive deeper into your specific processes." },
  { title: 'Assessment', icon: 'assessment', text: "I take a close look at how things actually work in your municipality. What processes eat up the most time? Where do things get stuck? What information is hard to find? This isn't about judging, it's about finding the biggest opportunities." },
  { title: 'Compliance', icon: 'governance', text: "Before we touch anything, we make sure we understand all your FOIP requirements and privacy obligations. AI is only helpful if it follows the rules, so we get crystal clear on what we can and can't do." },
  { title: 'Wins Training', icon: 'intelligence', text: "This is where we get practical. I work directly with your team to show them how these tools actually work in their day-to-day tasks, answer their questions, and help them feel confident instead of worried. No tech jargon, just practical hands-on learning." },
  { title: 'Pilot', icon: 'pilot', text: 'We start small with one or two processes and test everything thoroughly. Your team gets comfortable with the tools, we work out any kinks, and you can see real results before we expand to other areas.' },
  { title: 'Roll-Out', icon: 'rollout', text: "Once everyone's confident and the pilot is working well, we implement AI across the areas that will benefit most. This includes setting up proper workflows, training additional staff, making sure everything integrates smoothly, and providing ongoing support to help you adapt as your needs change." },
];

export default function WorkingProcess() {
  const [active, setActive] = useState<number>(0);
  const stage = stages[active];
  const activeId = active;
  return <div className="working-process"><div className="process-tabs" role="tablist" aria-label="Our Working Process">{stages.map((item, i) => <button key={item.title} type="button" role="tab" aria-selected={active === i} aria-controls={`process-panel-${i}`} id={`process-tab-${i}`} className={`process-tab${active === i ? ' is-active' : ''}`} onClick={() => setActive(i)}><span className="process-icon"><Icon type={item.icon as IconType} size={36}/></span><span>{item.title}</span></button>)}</div><div className="process-detail" role="tabpanel" id={`process-panel-${activeId}`} aria-labelledby={`process-tab-${activeId}`}><p>{stage.text}</p></div></div>;
}
