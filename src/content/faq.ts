export type FaqEntry = {
  question: string;
  answer: string;
};

/** Every FAQ entry, in display order. The homepage preview shows the first four; /faq shows them all. */
export const FAQ: FaqEntry[] = [
  {
    question: 'What is injily?',
    answer:
      "injily is being built to help churches, evangelists and mission teams follow up with new believers: keep track of each person after they respond, make sure someone is responsible for following up, and see who needs attention.",
  },
  {
    question: 'Who is it for?',
    answer:
      'Churches and pastors, evangelists, and mission and outreach teams: anyone who meets new believers and wants to make sure each one is followed up.',
  },
  {
    question: 'Is it available yet?',
    answer: "Not yet. We're building it now. Get early access and we'll be in touch.",
  },
  {
    question: 'How do we get started?',
    answer: 'Leave your details and someone from our team will be in touch shortly.',
  },
];
