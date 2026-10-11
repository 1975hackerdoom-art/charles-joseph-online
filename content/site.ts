// Verified against catchthebeat.ca and the supplied business card, 23 September 2026.
// Edit business details, service copy and article links here.
export const business = {
  email: 'digital@catchthebeat.ca',
  emailLink: 'mailto:digital@catchthebeat.ca?subject=Let%E2%80%99s%20talk%20about%20AI',
  booking: 'https://calendar.app.google/Kdfa15ZfDneaNq2s6',
};
export type NavigationItem = { label: string; href: string; children?: { label: string; href: string }[] };
export const navigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'What Clients Say', href: '/what-clients-say' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Services', href: '/services', children: [
    { label: 'AI for Local Government', href: '/ai-for-local-government' },
    { label: 'AI For Records Management', href: '/records_management' },
    { label: 'Policy Writing', href: '/policy_writing' },
    { label: 'AI Workshop', href: '/ai_workshop' },
    { label: 'AI for Council', href: '/ai-for-council' },
    { label: 'Fractional / Interim Leadership', href: '/fractional-interim-leadership' },
  ] },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
];
export const services = [
  { id: 'governance', title: 'AI Governance', intro: 'Clear guardrails. Confident decisions.', description: 'Build practical policies for how your team uses AI, handles information and keeps people accountable.', examples: 'AI use policies · Privacy considerations · Human review', detail: 'Start with the tools your staff use and the information they handle. Together, we identify permitted uses, review responsibilities and questions to work through with your privacy and legal advisers.', link: 'Explore governance' },
  { id: 'training', title: 'Training & Workshops', intro: 'Make the unfamiliar feel possible.', description: 'Help staff and leaders understand AI through approachable, hands-on learning grounded in municipal work.', examples: 'Staff workshops · Leadership learning · Everyday AI skills', detail: 'Explore drafting routine correspondence, checking AI outputs and recognising when a task needs human judgement. Sessions create room for questions and build confidence at your team’s pace.', link: 'Explore training' },
  { id: 'automation', title: 'Workflow Automation', intro: 'Less repetition. More room to serve.', description: 'Find sensible ways to simplify everyday processes, so your team can focus on the work that needs them.', examples: 'Routine correspondence · Records workflows · Meeting support', detail: 'Map a process that takes too much time, choose a manageable pilot and test it with your team. Build in human approval and review the results before expanding.', link: 'Explore automation' },
];
export const steps = [
  { title: 'Discover', text: 'A conversation about your team, your community and what you’d like to make easier.' },
  { title: 'Assess', text: 'Understand your workflows, information needs and constraints. Choose a practical starting point.' },
  { title: 'Pilot', text: 'Test a focused use case with your staff. Learn what works, review the risks and refine together.' },
  { title: 'Support', text: 'Build confidence through training and ongoing guidance as your needs evolve.' },
];
export const articles = [
  { category: 'AI & DATA GOVERNANCE', title: 'The Button Is Inside Copilot. Your Data May Not Be', description: 'A closer look at what model choices mean for municipal information.', url: 'https://catchthebeat.ca/the-button-is-inside-copilot-your-data-may-not-be/' },
  { category: 'RESPONSIBLE AUTOMATION', title: 'The Agent Can Find the Savings. It Cannot Sign the Contract.', description: 'Where useful AI support ends and human authority begins.', url: 'https://catchthebeat.ca/the-agent-can-find-the-savings-it-cannot-sign-the-contract/' },
];
