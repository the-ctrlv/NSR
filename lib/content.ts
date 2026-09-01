export const siteConfig = {
  name: "NSR Mallorca",
  tagline: "Taking the lead on local matters",
  heroSubtext:
    "From finding a solution and the right people to coordinating execution and representing your interests on Mallorca.",
  description:
    "NSR Mallorca is an independent local operating partner who takes the lead on complex private, property and business matters on Mallorca — coordinating professionals and representing your interests on the ground.",
  url: "https://www.nsrmallorca.com",
};

export const navLinks = [
  { label: "Matters", href: "#matters" },
  { label: "About", href: "#about" },
  { label: "NSR Approach", href: "#approach" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacts", href: "#contact" },
];

export const audienceLabels = ["Private Clients", "Property Owners", "Business Owners"];

export const problemCards = [
  {
    icon: "starburst",
    title: ["One matter.", "Different decisions"],
    body: "You are making a major family or personal change, and decisions around schooling, administration, healthcare or other practical matters need to stay aligned.",
  },
  {
    icon: "mesh",
    title: ["Multiple", "Professionals"],
    body: "You are buying a property, managing a renovation or dealing with a local business matter. Everyone is managing their part, while you are left trying to hold the wider process together.",
  },
  {
    icon: "wave",
    title: ["A stalled process"],
    body: "Documents have been submitted. Conversations have taken place. The expected steps have been followed — but it is still unclear what is holding the process up and what needs to happen next.",
  },
  {
    icon: "lines",
    title: ["You can't be", "there yourself"],
    body: "A meeting needs to happen, someone needs access to the property, a professional needs an answer — or you need someone on Mallorca to understand what is actually happening on the ground.",
  },
] as const;

export const realityReveal = {
  eyebrow: "The Mallorca Reality",
  intro: {
    heading: "You can have the best professionals, but NO ONE connects their efforts.",
    body: "Mallorca has excellent professionals. The challenge begins when several are involved and no one is responsible for keeping the whole process connected.",
  },
  lines: [
    "Communication becomes fragmented.",
    "Responsibilities become unclear.",
    "Important details get lost.",
    "Timelines drift.",
  ],
  statement: "You become the project manager of your own life on Mallorca.",
};

export const solution = {
  eyebrow: "About",
  heading: ["Having the right", "professionals is only part", "of the solution."],
  paragraphs: [
    "What is often missing is one person who sees the whole picture, connects the people involved and keeps the process moving.",
    "I don't replace your professionals. I coordinate the process around their respective expertise, focused on the outcome you need.",
  ],
  flow: ["You", "NSR Mallorca", "Professionals"],
  professionals: [
    "Lawyers",
    "Gestors",
    "Real Estate Agents",
    "Contractors",
    "Banks",
    "Insurers",
    "Local Providers",
  ],
};

export const founderReveal = {
  eyebrow: "The Person Behind NSR",
  intro:
    "Founder-led, personal and accountable — with the local understanding to take responsibility for moving a situation forward.",
  name: "Nataliia Sychenko Romanova",
  stats: [
    { value: "12+", label: "Years on Mallorca." },
    { value: "20+", label: "Years in international business." },
    {
      value: "4",
      label: "Languages",
      detail: "English • Spanish • Russian • Ukrainian",
    },
  ],
  background: {
    eyebrow: "My background",
    paragraphs: [
      "My background spans international operations, procurement and logistics - managing multiple parties, deadlines and negotiations, with a strong focus on getting things done.",
      "Today, I bring that experience together with deep local understanding of Mallorca to find practical solutions to complex matters and ensure consistent follow-through.",
    ],
  },
  quote:
    "NSR Mallorca is an independent private practice built around personal involvement, direct communication and accountability.",
};

export const approachSteps = [
  {
    number: "01",
    title: "Understand & Define",
    body: "I understand what needs to be resolved, clarify your objective and agree the scope of my involvement with you.",
  },
  {
    number: "02",
    title: "Structure & Plan",
    body: "I structure the process, map out the next steps and identify where professional input may be needed.",
  },
  {
    number: "03",
    title: "Source & Negotiate",
    body: "I source suitable professionals and providers, compare options and negotiate scope, terms and timelines for your consideration.",
  },
  {
    number: "04",
    title: "Coordinate & Represent",
    body: "Once the direction is agreed, I coordinate the people and agreed actions, manage communication and represent your interests locally where needed.",
  },
  {
    number: "05",
    title: "Oversee & Report",
    body: "I follow progress, agreed actions and timelines, keep you informed and flag anything that requires your attention or decision.",
  },
] as const;

export const approach = {
  eyebrow: "NSR Approach",
  heading: "Different situations. One operational approach.",
};

export const serviceCategories = {
  eyebrow: "Matters",
  heading:
    "One approach, applied to matters across your private life, property and business on Mallorca.",
  categories: [
    {
      icon: "private",
      title: "Private Client Affairs",
      body: "Personal and family matters that require attention on Mallorca — from individual issues to more complex situations involving several parties.",
      tags: [
        "Administrative Matters",
        "Family Transitions",
        "Education",
        "Healthcare",
        "Banking",
        "Insurance",
        "Unexpected Local Issues",
      ],
    },
    {
      icon: "property",
      title: "Property",
      body: "Matters related to acquiring, owning or improving property on Mallorca.",
      tags: [
        "Property Acquisition",
        "Property Improvements",
        "Contractor Matters",
        "Ownership",
        "Administration",
        "Ongoing Property Issues",
      ],
    },
    {
      icon: "business",
      title: "Business & Local Operations",
      body: "Local matters connected to your business or company on Mallorca.",
      tags: [
        "Administrative Matters",
        "Local Providers",
        "Professional Follow-Up",
        "Outstanding Issues",
      ],
    },
  ],
} as const;

export const quoteBand = {
  eyebrow: "Why NSR",
  quote:
    "The value isn't in knowing every answer. It's in knowing who to call, what to ask, and when to step in.",
  body: "Every situation on Mallorca moves faster with one person accountable for the whole picture — not just their own part of it.",
  cta: { label: "Share your situation", href: "#contact" },
};

export const workingTogether = {
  eyebrow: "Ways of Working Together",
  heading:
    "The way we work together depends on your situation, the scope involved and whether you need support for a specific matter or ongoing local continuity.",
  models: [
    {
      index: "01",
      title: "Project-based Engagement",
      body: "For a specific matter or project with a defined objective. The scope of my involvement is agreed at the outset and tailored to the situation.",
    },
    {
      index: "02",
      title: "Ongoing local partner",
      body: "For clients who need trusted local involvement across different matters over time. This creates continuity, retained context and a reliable local point of contact as new situations arise.",
    },
  ],
} as const;

export const faq = {
  eyebrow: "FAQ",
  heading: "Everything you may want to know",
  items: [
    {
      question: "What exactly do you do?",
      answer:
        "I take the lead on complex local matters on Mallorca — understanding what needs to be resolved, structuring the process, sourcing the right professionals, and coordinating and overseeing the work until it's done.",
    },
    {
      question: "Do you replace lawyers, gestors or other professionals?",
      answer:
        "No. I coordinate the process around their expertise rather than replacing it, so every specialist is focused on their part while someone stays accountable for the whole outcome.",
    },
    {
      question: "What kind of matters do you help with?",
      answer:
        "Private client affairs, property matters and business or local operations — anything from a single administrative issue to a multi-party process involving several professionals.",
    },
    {
      question: "How does an engagement start?",
      answer:
        "You share your situation, we agree the objective and scope together, and I put together an action plan before bringing in the right people.",
    },
    {
      question: "Can you represent me when I'm not on the island?",
      answer:
        "Yes. Attending meetings, accessing property, liaising with professionals and following up locally on your behalf is a core part of the role.",
    },
    {
      question: "Do you work on a single matter or ongoing basis?",
      answer:
        "Both. Engagements can be project-based with a defined scope, or ongoing for clients who want a consistent local point of contact over time.",
    },
    {
      question: "Which areas of Mallorca do you work in?",
      answer:
        "I work across the island, with particular depth in the matters and networks relevant to private clients, property owners and business owners locally based here.",
    },
  ],
};

export const closingCta = {
  labels: ["Confidential", "Independent", "Personal"],
  heading: ["You bring the situation.", "I build the process around", "the outcome you need"],
  body: "You stay informed. You make the decisions that matter. You don't have to manage everything in between.",
  cta: { label: "Let's talk in WhatsApp", href: "https://wa.me/380737777777" },
  contacts: [
    { label: "WhatsApp", value: "+380 73-777-77-77", href: "https://wa.me/380737777777" },
    { label: "Email", value: "NSR@gmail.com", href: "mailto:NSR@gmail.com" },
    { label: "LinkedIn", value: "Nataliia Sychenko Romanova", href: "#" },
  ],
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} NSR Mallorca. All rights reserved.`,
  links: [
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};
