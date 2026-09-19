export const siteConfig = {
  name: "NSR Mallorca",
  tagline: "Complex matters on Mallorca",
  // The site's only <h1> (see Hero.tsx) — previously had no geo keyword
  // in it at all, the single most SEO-weighted line on the page.
  tagline2: "Taking the lead on Mallorca's local matters",
  heroSubtext:
    "From finding a solution and the right people to coordinating execution and representing your interests on Mallorca.",
  description:
    "NSR Mallorca is an independent local operating partner who takes the lead on complex private, property and business matters on Mallorca — coordinating professionals and representing your interests on the ground.",
  // Shorter, keyword-led variant for the <meta name="description"> tag
  // specifically — search engines truncate around ~155-160 characters, so
  // this leads with the highest-value terms instead of reusing the longer
  // description above (still used as-is for Open Graph/Twitter/JSON-LD,
  // where the full length reads fine).
  metaDescription:
    "NSR Mallorca — independent local operating partner and trusted local representative for private clients relocating, buying property or moving a business to Spain.",
  url: "https://www.nsrmallorca.com",
};

// Single source of truth for the site's target search terms, grouped by
// intent/use — shared between page <meta keywords>, JSON-LD structured
// data and any future landing copy. Kept separate from siteConfig since
// these are SEO-facing, not user-facing, strings.
export const seoKeywords = {
  primary: [
    "local representative Mallorca",
    "relocation coordinator Mallorca",
    "independent local operating partner Mallorca",
    "private client services Mallorca",
    "trusted local partner Mallorca",
    "family relocation assistance Mallorca",
    "buying property in Mallorca as a foreigner",
    "moving business to Spain",
    "business relocation Mallorca",
  ],
  secondary: [
    "remote property management Mallorca",
    "managing property in Mallorca while living abroad",
    "reactivating a Spanish company",
    "local fixer Mallorca",
    "point of contact on Mallorca",
    "property acquisition Mallorca foreign buyer",
    "renovation coordination Mallorca",
    "contractor management Mallorca",
    "local business compliance Mallorca",
    "company administration Mallorca foreign owner",
  ],
  geo: [
    "Mallorca",
    "Majorca",
    "Palma de Mallorca",
    "Balearic Islands",
    "Spain",
  ],
  audience: [
    "German expats Mallorca",
    "British expats Mallorca",
    "international family Mallorca",
    "foreign property owner Mallorca",
    "non-resident business owner Spain",
  ],
  brand: ["NSR Mallorca", "Nataliia Sychenko Romanova"],
};

export const navLinks = [
  { label: "Matters", href: "#matters" },
  { label: "About", href: "#about" },
  { label: "NSR Approach", href: "#approach" },
  { label: "FAQ", href: "#faq" },
  { label: "Contacts", href: "#contact" },
];

export const audienceLabels = [
  "Private Clients",
  "Property Owners",
  "Business Owners",
];

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
    icon: "waves",
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
    heading:
      "You can have the best professionals, but NO ONE connects their efforts.",
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
  eyebrow: "The Missing Link",
  heading: [
    "Having the right",
    "professionals is only part",
    "of the solution.",
  ],
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
  intro: "",
  name: "Nataliia Sychenko Romanova",
  stats: [
    { value: "12 +", label: "Years on Mallorca." },
    { value: "20 +", label: "Years in international business." },
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
  eyebrow: "Areas of Involvement",
  intro:
    "One approach, applied to matters across your private life, property and business on Mallorca.",
  categories: [
    {
      icon: "private",
      title: "Private Client Affairs",
      body: "Personal and family matters that require attention on Mallorca — from individual issues to more complex situations involving several parties.",
      tagRows: [
        ["Administrative Matters", "Family Transition"],
        ["Education", "Healthcare", "Banking", "Insurance"],
        ["Unexpected Local Issues"],
      ],
    },
    {
      icon: "property",
      title: "Property",
      body: "Matters related to acquiring, owning\nor improving property on Mallorca.",
      tagRows: [
        ["Property Acquisition", "Renovations"],
        ["Property Improvements", "Property Administration"],
      ],
    },
    {
      icon: "business",
      title: "Business & Local Operations",
      body: "Local matters connected to your business\nor company on Mallorca.",
      tagRows: [
        ["Administrative Matters", "Local Providers"],
        ["Business Projects", "Operational Issues"],
      ],
    },
  ],
} as const;

export const practiceCases = {
  eyebrow: "NSR in Practice",
  cases: [
    {
      title: "Navigating local systems",
      intro:
        "My local understanding is grounded in more than 12 years of living on Mallorca and navigating Spanish systems first-hand — through to obtaining Spanish citizenship.",
      roleLabel: "Experience",
      lead: "This has involved multiple institutions and processes across:",
      list: [
        "Identification",
        "Social Security",
        "Tax administration",
        "Municipal registration",
        "Healthcare, banking",
        "and other areas of everyday life.",
      ],
      body: "It has given me a practical understanding of how local processes connect, where professional input may be needed and why the sequence of actions matters.",
      counter: "01 / 03",
    },
    {
      title: "Managing a family transition",
      intro:
        "An international family needed to establish a new base on Mallorca while remaining abroad during much of the process. What initially appeared to be a series of separate matters quickly became one interconnected project involving property, education, administration and multiple local parties.",
      roleLabel: "My role",
      paragraphs: [
        "I took responsibility for structuring and coordinating the process on Mallorca, keeping decisions around location and property aligned with the family's schooling and practical priorities.",
        "Where physical presence was required, I represented the clients locally — including attending selected property viewings and providing independent feedback to support their decisions.",
        "Residency-related matters progressed through the relevant professionals, while I maintained oversight across the wider process and followed through locally.",
      ],
      counter: "02 / 03",
    },
    {
      title: "Returning to business in Spain",
      intro:
        "A German business owner established a company in Spain in 2019, with my involvement in its local administrative coordination from the early stages. Five years after suspending its activity, he decided to return to the Spanish market.",
      roleLabel: "My role",
      paragraphs: [
        "I took responsibility for structuring and coordinating the process of resuming activity, aligning the administrative steps required with the client's timeline.",
        "Where physical presence was required, I represented the client locally — liaising with the relevant local providers and following up on outstanding administrative matters.",
        "Professional matters progressed through the relevant advisors, while I maintained oversight across the wider process and followed through locally.",
      ],
      counter: "03 / 03",
    },
  ],
} as const;

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
  eyebrow: "Frequently Asked Questions",
  heading: ["What you may", "want to know"],
  items: [
    {
      question: "How does the first conversation work?",
      answer:
        "The first conversation is confidential and exploratory. We discuss your situation, what is already in place and what you would like to achieve. If NSR is a good fit, we will then define the scope of involvement and the most appropriate working format.",
    },
    {
      question:
        "Can you work with my existing professionals — or find new ones if needed?",
      answer:
        "Yes. I can work with professionals you already trust and, where additional expertise is needed, help identify and source appropriate professionals. Each professional remains responsible for their own area of expertise.",
    },
    {
      question: "Do you provide legal, tax or other professional advice?",
      answer:
        "No. Legal, tax, technical and other professional advice is provided by the relevant professionals. Where such expertise is required, I work alongside them while coordinating the wider process from the client's side.",
    },
    {
      question: "Do you work only with clients who live on Mallorca?",
      answer:
        "No. I work with international clients whose private, property or business matters require local involvement on Mallorca — whether they live here, spend part of their time on the island or are based abroad.",
    },
    {
      question: "How are fees defined?",
      answer:
        "Fees depend on the scope and complexity of the matter and whether the engagement is project-based or ongoing. Once the scope of involvement is clear, the fee is agreed before the work begins.",
    },
    {
      question: "Who can represent me if I'm not based in Mallorca?",
      answer:
        "I act as your on-the-ground representative — coordinating professionals, communicating with local parties and keeping your matter moving even when you are not physically on the island.",
    },
    {
      question: "Do I need to be in Mallorca to buy property here?",
      answer:
        "In most cases, no. With the right representation in place, viewings, due diligence and coordination with notaries and other professionals can proceed on your behalf — you stay informed and only need to be involved where your personal presence is legally required.",
    },
    {
      question: "How does relocating to Mallorca work?",
      answer:
        "It starts with understanding your situation and priorities, then coordinating the practical steps — administration, property, schooling, healthcare or business matters — with the right local professionals, so nothing falls between the cracks.",
    },
    {
      question: "Who can help coordinate multiple professionals in Mallorca?",
      answer:
        "As your local operating partner, I coordinate the different professionals involved in your matter — lawyers, agents, contractors and administrators — so you have one point of contact managing the process instead of juggling each relationship yourself.",
    },
  ],
};

export const closingCta = {
  labels: ["Confidential", "Independent", "Personal"],
  heading: [
    "You bring the situation.",
    "I build the process around",
    "the outcome you need",
  ],
  body: "You stay informed. You make the decisions that matter. You don't have to manage everything in between.",
  cta: { label: "SHARE YOUR SITUATION", href: "https://wa.me/380737777777" },
  contacts: [
    {
      label: "WhatsApp",
      value: "+380 73-777-77-77",
      href: "https://wa.me/380737777777",
    },
    { label: "Email", value: "NSR@gmail.com", href: "mailto:NSR@gmail.com" },
    { label: "LinkedIn", value: "Nataliia Sychenko Romanova", href: "#" },
  ],
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} NSR Mallorca. All rights reserved.`,
  links: [
    { label: "Legal Notice", href: "#" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "#" },
  ],
};

type PolicyListItem = string | { label: string; text: string };

type PolicySection = {
  heading: string;
  body?: string;
  list?: PolicyListItem[];
  after?: string;
};

export const privacyPolicy = {
  title: "Privacy policy",
  intro: [
    `${siteConfig.name} ("we," "our," or "us") is an independent local operating partner based in Mallorca, Spain.`,
    `This Privacy Policy explains how we collect, use, and protect personal information when you visit ${siteConfig.url.replace("https://www.", "")} or interact with our services.`,
    "We are committed to protecting your privacy and handling your personal data transparently and in accordance with applicable data protection law, including the EU General Data Protection Regulation (GDPR) and Spain's LOPDGDD.",
  ],
  scope: {
    heading: "Scope",
    body: "This policy applies to personal information collected through our website and services. By using our site, you agree to the terms described in this Privacy Policy.",
  },
  sections: [
    {
      heading: "A. Information collected automatically",
      body: "When you visit our website, we automatically collect certain technical information using tools such as Google Analytics, including:",
      list: [
        "IP address",
        "Browser type and version",
        "Device identifiers",
        "Pages viewed and time spent on the site",
        "Referring website addresses.",
      ],
    },
    {
      heading: "B. Information you provide voluntarily",
      body: "You may choose to share personal information with us when:",
      list: ["Filling out a contact form", "Communicating with us directly."],
      after:
        "This may include your name, email address, phone number, company name, and other business-related details.",
    },
    {
      heading: "C. Information from other sources",
      body: "We may receive limited business-related information from third-party sources, such as tools that provide aggregated or inferred data based on your IP address and public records.",
      list: ["Filling out a contact form", "Communicating with us directly."],
      after:
        "This may include your name, email address, phone number, company name, and other business-related details.",
    },
    {
      heading: "How we use your information",
      body: "We use the information we collect to:",
      list: [
        "Provide and improve our services",
        "Respond to inquiries and service requests",
        "Analyze usage trends to improve user experience",
        "Maintain security and prevent fraud.",
      ],
    },
    {
      heading: "Sharing of personal information",
      body: "We may share your information with:",
      list: [
        {
          label: "Service providers",
          text: "who support the operation of our website and services (e.g., hosting, analytics), under confidentiality obligations",
        },
        {
          label: "Law enforcement or regulators,",
          text: "when required by applicable law or to protect legal rights",
        },
      ],
    },
    {
      heading: "Your privacy rights",
      body: "Depending on your location, you may have the following rights under applicable data protection law, including the GDPR:",
      list: [
        {
          label: "Right to know:",
          text: "You may request details about the categories and specific pieces of personal information we collect, use, or disclose.",
        },
        {
          label: "Right to delete:",
          text: "You may request that we delete personal information we have collected about you, subject to certain exceptions.",
        },
        {
          label: "Right to correct:",
          text: "You may request correction of inaccurate personal information we hold about you.",
        },
        {
          label: "Right to opt out of sale or sharing:",
          text: "We do not sell or share personal information for cross-context behavioral advertising.",
        },
        {
          label: "Right to non-discrimination:",
          text: "We will not discriminate against you for exercising any of your privacy rights.",
        },
      ],
      after:
        "To exercise your privacy rights, please email us at: NSR@gmail.com. Please include your name, the nature of your request, and sufficient information for us to process it. We may need to verify your identity before fulfilling certain requests.",
    },
    {
      heading: "Data security and retention",
      body: "We use reasonable administrative, technical, and physical safeguards to protect personal information from loss, misuse, or unauthorized access. Information is retained only as long as necessary for the purposes outlined in this policy, or as required by applicable law.",
    },
    {
      heading: "Children's privacy",
      body: "Our website is not intended for children under 13 years of age. We do not knowingly collect or maintain personal information from children. If you believe we have inadvertently collected data from a child, please contact us, and we will promptly delete it.",
    },
    {
      heading: "Changes to this privacy policy",
      body: "We may update this Privacy Policy from time to time. Your continued use of our website after such changes constitutes your acknowledgment of the updated policy.",
    },
    {
      heading: "Contact us",
      body: "If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at: NSR@gmail.com.",
    },
  ] satisfies PolicySection[],
  quote:
    "Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus.",
};
