export type InsightArticle = {
  slug: string;
  title: string;
  category: string;
  preview: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
  question: string;
  guideLink?: boolean;
};

export const insightArticles: InsightArticle[] = [
  {
    slug: 'great-faith-begins-with-recognising-authority',
    title: 'Great Faith Begins with Recognising Authority',
    category: 'Faith & Life',
    preview: 'The centurion understood that Jesus did not need to be physically present to exercise His authority. His response offers a practical lesson about faith.',
    image: 'charles-hero.jpeg', imageAlt: 'Charles Joseph seated at a desk',
    paragraphs: [
      'In Matthew 8:5–13, a centurion approached Jesus because his servant was suffering. When Jesus offered to come and heal him, the centurion replied that a word from Jesus would be enough.',
      'His confidence rested on an understanding of authority. As a military officer, he knew what it meant to give and receive commands. He recognised that Jesus possessed authority over the condition troubling his servant. Jesus did not need to enter the house before His word could accomplish something there.',
      'Jesus marvelled at his faith. The centurion’s response challenges us to consider what we believe about the authority of Christ. Do we trust His word only when circumstances begin to improve? Must everything happen in a familiar way before we can believe?',
      'Faith does not require us to pretend that difficulty is absent. The centurion acknowledged the suffering clearly. He brought the problem to Jesus with confidence that Jesus could address it.',
      'There was also humility in his approach. Although he held a position of authority, he did not make demands based on his rank. He recognised his need and appealed to someone whose authority exceeded his own.',
      'That combination matters: confidence in Christ and humility about ourselves. For us today, faith involves bringing our concerns to God, taking His teaching seriously and acting in obedience even when we cannot control the outcome. It does not mean that we can command God to follow our preferred timetable.',
      'The question is whether our response to Jesus reflects confidence in His authority.'
    ],
    question: 'Where am I allowing uncertainty about the circumstances to weaken my willingness to trust and obey Christ?'
  },
  {
    slug: 'alignment-must-show-up-in-your-decisions',
    title: 'Alignment Must Show Up in Your Decisions', category: 'Faith & Life',
    preview: 'A declaration of purpose becomes meaningful when it influences how we use our time, honour our responsibilities and make everyday choices.',
    image: 'charles-black.jpeg', imageAlt: 'Charles Joseph in a black shirt',
    paragraphs: [
      'It is possible to speak confidently about purpose while making decisions that pull us away from it. We may say that family matters while giving it only our leftover attention. We may desire business growth while avoiding the work of understanding customers. We may speak about spiritual maturity while neglecting prayer, Scripture and obedience.',
      'Alignment asks us to examine the relationship between what we profess and what we practise. This is not a demand for perfection. It is an invitation to honesty.',
      'Our calendars, commitments and spending reveal something about our priorities. When those patterns repeatedly conflict with what we believe matters, we need to make adjustments.',
      'Sometimes the problem is that we have accepted too many responsibilities. Every opportunity can appear worthwhile, but each one requires time and attention. Saying yes without considering the cost can weaken commitments we have already made.',
      'At other times, we know the necessary step but postpone it because it is uncomfortable. We may need to apologise, put a neglected responsibility in order or stop pursuing something that no longer serves a useful purpose.',
      'Faith can help us take those steps. We can seek God’s direction while accepting responsibility for the choices within our control. A useful starting point is to identify one important commitment and ask whether our daily behaviour supports it. Then make a specific adjustment.',
      'If health matters, what habit needs attention? If leadership matters, what responsibility requires follow-through? If a business is worth building, what work should receive protected time this week? Alignment becomes visible through repeated decisions.'
    ],
    question: 'What is one change I can make this week to bring my actions closer to my stated priorities?'
  },
  {
    slug: 'accountability-is-part-of-leadership',
    title: 'Accountability Is Part of Leadership', category: 'Leadership',
    preview: 'A title gives someone responsibility. Clear commitments, honest reporting and consistent follow-through help them earn trust.',
    image: 'charles-suit.jpeg', imageAlt: 'Charles Joseph in a suit',
    paragraphs: [
      'People need to understand what they can expect from a leader. They need clarity about decisions, responsibilities and what will happen when a commitment is missed. Without that clarity, even a capable team can become frustrated.',
      'Accountability begins with making commitments specific. “We are working on it” may be an honest statement, but it does not tell others what has been completed, what remains unresolved or when an update will arrive.',
      'A more useful report explains the task, the person responsible, the progress made and the obstacle requiring attention. It gives people enough information to act.',
      'Leaders should apply that standard to themselves as well. When a decision does not produce the intended result, we need to examine our assumptions and explain what we have learned. When we miss a commitment, we should acknowledge it and establish a realistic next step.',
      'Accountability also requires judgment. A missed deadline caused by unclear instructions is different from repeated neglect. A team member who raises a problem early should be able to expect a fair hearing.',
      'If people believe every admission of difficulty will lead to humiliation, they may hide information until the problem becomes much harder to resolve. The goal is a working environment where people understand their responsibilities and communicate honestly about them.',
      'This applies in businesses, churches, community organisations and families. Wherever people depend on one another, clarity and follow-through matter. Leadership becomes more credible when our conduct makes it easier for others to trust what we say.'
    ],
    question: 'Review one current project. Can everyone involved clearly explain the commitment, the responsible person and the next review date?'
  },
  {
    slug: 'a-good-idea-still-needs-customers',
    title: 'A Good Idea Still Needs Customers', category: 'Business & Enterprise',
    preview: 'Before investing heavily in a business idea, find out who needs it, what they currently do and whether they will pay for a better outcome.',
    image: 'charles-office.jpeg', imageAlt: 'Charles Joseph seated beside a stack of books',
    paragraphs: [
      'An idea can make perfect sense to its founder and still struggle to attract customers. The founder sees the possibilities. The customer sees a decision: Is this useful enough to deserve my money, time or attention? That difference deserves serious thought.',
      'Before building too much, we need to understand the problem from the customer’s perspective. What happens today? What does the problem cost them? How often does it occur? What have they already tried?',
      'A conversation becomes more useful when it moves beyond asking, “Do you like my idea?” People may encourage us because they want to be polite. Their enthusiasm does not necessarily mean they will buy.',
      'Ask instead about a recent experience. Invite people to describe how they handled the situation and what made it difficult. Listen for specific behaviour rather than general approval.',
      'Then consider a small test. Can you deliver the service to a few customers? Can you test one use case before expanding? Can you demonstrate an outcome clearly enough that someone is willing to pay?',
      'A test should help answer a real question. Perhaps you need to discover whether the need is urgent, whether the price is workable or whether the customer trusts the delivery process.',
      'You also need a way to reach people. A useful product can remain unnoticed if the intended customers never encounter it through a channel they trust. Vision gives the business direction. Customer evidence helps determine the next investment.'
    ],
    question: 'What have customers actually done that shows demand for my idea?'
  },
  {
    slug: 'before-you-pay-for-property-in-nigeria',
    title: 'Before You Pay for Property in Nigeria', category: 'Property & Diaspora',
    preview: 'Buying from abroad requires a clear process for checking the property, the seller and the documents before money changes hands.',
    image: 'charles-certificates.jpeg', imageAlt: 'Charles Joseph beside framed certificates', guideLink: true,
    paragraphs: [
      'Buying property while living abroad creates a practical challenge: you may be making a major commitment using information supplied by people you cannot easily meet or supervise.',
      'Photographs, videos and reassuring conversations can help you understand an opportunity. They cannot establish everything you need to know. Before paying, clarify what is being sold, who has the authority to sell it and what evidence supports those claims.',
      'Arrange an independent inspection of the actual property. Make sure the location and boundaries being discussed correspond to what is physically present. If construction is involved, establish the current condition and the work still required.',
      'Use an independent lawyer with relevant local property experience to assess the transaction and advise on the appropriate document and ownership checks. Depending on the property, other professionals may also be necessary.',
      'Independence matters. A person introduced by the seller may be competent, but you should understand whom they represent and whose interests they are responsible for protecting.',
      'Be equally clear about payment. Know who will receive the money, what each payment covers and what written agreement governs the transaction. Where payments relate to construction progress, seek professional advice on defining milestones and the evidence needed before further payment.',
      'Pressure to pay quickly should not determine your process. Distance makes documentation and verification especially valuable. A careful process gives you a stronger basis for deciding whether to proceed.'
    ],
    question: 'Write down the facts you have independently checked and those you are still accepting on someone else’s assurance.'
  },
  {
    slug: 'knowing-someones-identity-is-only-the-beginning',
    title: 'Knowing Someone’s Identity Is Only the Beginning', category: 'Digital Trust',
    preview: 'Identity verification answers an important question. A transaction also needs clear commitments, appropriate evidence and a process for handling problems.',
    image: 'charles-desk.jpeg', imageAlt: 'Charles Joseph working at a desk',
    paragraphs: [
      'Identity verification is an important starting point in commerce. It helps establish who a person is. But knowing someone’s identity does not tell us whether a particular job has been completed, whether goods meet an agreed specification or whether a payment should be released.',
      'Consider a customer hiring a contractor. Both parties may have verified identities, yet still disagree about the scope of work, the completion date or the quality expected.',
      'The transaction needs a clear agreement. It also needs a way to record progress and assess evidence against that agreement. Even then, problems can arise. Evidence may be incomplete. Expectations may differ. One party may dispute what the other considers finished.',
      'A useful trust process must account for those situations. Who reviews the issue? What information will they consider? How can the parties raise a concern? What happens next?',
      'Technology can help organise records, make commitments visible and support more consistent processes. Human judgment remains necessary, particularly where evidence is disputed.',
      'At Amaripay, these questions shape how we think about digital trust infrastructure. Our vision extends from knowing who is involved to creating greater visibility around what was agreed, what happened and how responsibilities are handled.',
      'That vision should be judged by practical outcomes: whether people understand their commitments, whether evidence is useful and whether problems can be addressed through a clear process. Trust grows when participants have sound reasons for confidence.'
    ],
    question: 'Beyond verifying identity, what helps the people in your transactions know that commitments will be taken seriously?'
  }
];

export function getInsight(slug: string) { return insightArticles.find((article) => article.slug === slug); }
