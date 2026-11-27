export type FaqEntry = {
  question: string;
  answer: string;
};

/** Every FAQ entry, in display order. The homepage preview shows the first four; /faq shows them all. */
export const FAQ: FaqEntry[] = [
  {
    question: 'What is injily?',
    answer:
      'injily helps churches, evangelists and mission teams keep track of new believers, pair them with mentors and follow up, so nobody who makes a decision is forgotten.',
  },
  {
    question: 'Who is it for?',
    answer:
      'Churches and pastors, evangelists and missioners, and mission and outreach teams: anyone who meets new believers and wants to see them grow.',
  },
  {
    question: 'Do converts need an account?',
    answer: 'No, only your team does. Converts never have to sign up or sign in.',
  },
  {
    question: 'Can a missioner serve more than one church?',
    answer: 'Yes. A missioner can serve more than one church.',
  },
  {
    question: 'Can we bring our team in at once?',
    answer: 'Yes. Import a CSV or Excel file and your whole team is added at once.',
  },
  {
    question: 'Is our data private?',
    answer: "Yes. Only your church's team can see your converts.",
  },
  {
    question: 'What does it cost?',
    answer: 'injily is free while in early access.',
  },
  {
    question: 'Is there a mobile app?',
    answer: "injily works in your phone's browser, so there's nothing to install.",
  },
  {
    question: 'How do we get started?',
    answer: 'Request early access and someone from our team will follow up shortly.',
  },
];
