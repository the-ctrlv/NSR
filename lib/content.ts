export const siteConfig = {
  name: "NSR Mallorca",
  tagline: "Complex matters on Mallorca",
  // H1 — per the final approved SEO Developer Brief (section 2, "Exact
  // implementation"). Was "Taking the lead on local matters".
  tagline2: "Taking the lead on local matters",
  heroSubtext:
    "From finding a solution and the right people to coordinating execution and representing your interests on Mallorca.",
  description:
    "NSR Mallorca is an independent local operating partner who takes the lead on complex private, property and business matters on Mallorca — coordinating professionals and representing your interests on the ground.",
  // <title> — exact text from the final approved SEO Developer Brief
  // (section 2). Was "NSR Mallorca — Complex matters on Mallorca".
  metaTitle: "Private Client Services and Local Representation | NSR Mallorca",
  // <meta name="description"> — exact text from the final approved SEO
  // Developer Brief (section 2). Kept separate from `description` above
  // (still used as-is for Open Graph/Twitter/JSON-LD) since the brief only
  // specifies this one element.
  metaDescription:
    "Independent private client services and local representation in Mallorca for international families, property owners and business owners who need trusted coordination.",
  // No <meta name="keywords"> tag — per the final approved SEO Developer
  // Brief (section 2): Google hasn't used it for ranking since 2009, and
  // it must never be used to smuggle in services NSR doesn't offer.
  url: "https://www.nsrmallorca.com",
};

// Areas the practice actually serves, for JSON-LD `areaServed` only — not
// a keyword list (see the approved SEO brief: no meta keywords tag, no
// keyword-stuffed metadata anywhere on the site).
export const serviceAreas = [
  "Mallorca",
  "Palma de Mallorca",
  "Balearic Islands",
  "Spain",
];

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
      "My background spans international operations, procurement and logistics — managing multiple parties, deadlines and negotiations, with a strong focus on getting things done.",
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
        "I coordinated the review of the company’s status with the relevant professionals,helping to restore the necessary access, clarify outstanding obligations and establish the next steps towards reactivation. Today, I continue to coordinate selected business and private matters for the same client on Mallorca.",
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
      title: "Ongoing Local Partner",
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
  ],
};

export const closingCta = {
  labels: ["Confidential", "Independent", "Personal"],
  heading: [
    "You bring the situation.",
    "I build the process around",
    "the outcome you need.",
  ],
  body: "You stay informed. You make the decisions that matter. You don't have to manage everything in between.",
  cta: { label: "SHARE YOUR SITUATION", href: "https://wa.me/34656356628" },
  contacts: [
    {
      label: "WhatsApp",
      value: "+34 656 356 628",
      href: "https://wa.me/34656356628",
    },
    {
      label: "Email",
      value: "contact@nsrmallorca.com",
      href: "mailto:contact@nsrmallorca.com",
    },
    {
      label: "LinkedIn",
      value: "Nataliia Sychenko Romanova",
      href: "https://www.linkedin.com/in/nataliia-sychenko-romanova/",
    },
  ],
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} NSR Mallorca. All rights reserved.`,
  links: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
  ],
};

export const cookieConsent = {
  body: "We use cookies to understand how visitors use this site (Google Analytics). You can accept or reject non-essential cookies.",
  policyLabel: "Cookies Policy",
  policyHref: "/cookie-policy",
  accept: "Accept",
  reject: "Reject",
};

type PrivacyParagraph =
  | string
  | { text: string; linkText: string; linkHref: string; after?: string };
type PrivacyListItem = string | { label: string; text: string };
type PrivacyBlock =
  | { kind: "p"; content: PrivacyParagraph; bold?: boolean }
  | { kind: "list"; items: PrivacyListItem[] };
type PrivacySection = { heading: string; blocks: PrivacyBlock[] };

// Real, specific policy for how this site actually works (no contact form,
// WhatsApp/email/LinkedIn as the only data channels) — replaces an earlier
// generic template that inaccurately implied automatic tracking (IP,
// device identifiers, etc.) this site doesn't do. Bracketed placeholders
// ([legal name — pending registration], [X months — to confirm], etc.)
// are carried over verbatim from the approved copy — pending confirmation
// from legal counsel, not something to guess at here.
export const privacyPolicy = {
  title: "Privacy Policy — NSR Mallorca",
  lastUpdated: "September 2026",
  intro:
    "This Privacy Policy explains how NSR Mallorca handles personal data in connection with this website.",
  sections: [
    {
      heading: "1. Who is responsible for your data",
      blocks: [
        {
          kind: "p",
          content:
            "NSR Mallorca ([legal name — pending registration]) is the data controller responsible for the personal data described in this policy.",
        },
        {
          kind: "p",
          content: {
            text: "Contact: ",
            linkText: "contact@nsrmallorca.com",
            linkHref: "mailto:contact@nsrmallorca.com",
          },
        },
      ],
    },
    {
      heading: "2. This website does not collect personal data",
      blocks: [
        {
          kind: "p",
          content:
            "This website has no contact form, account creation, or any mechanism that submits your data to us. It simply displays Nataliia's contact details and a button that opens a WhatsApp chat with her. Clicking that button does not transmit any information through the website itself — it only opens WhatsApp on your device or browser. Any data exchange happens directly between you and Nataliia, on WhatsApp.",
        },
      ],
    },
    {
      heading: "3. What data we collect, and how",
      blocks: [
        {
          kind: "p",
          bold: true,
          content:
            "We only collect personal data if you choose to contact us directly, through one of the following channels:",
        },
        {
          kind: "list",
          items: [
            {
              label: "WhatsApp",
              text: "— your phone number, your name as set in your WhatsApp profile, and the content of the messages you send.",
            },
            {
              label: "Email",
              text: "— your email address, your name if you provide it, and the content of your message.",
            },
            {
              label: "LinkedIn",
              text: "— information visible on your profile or shared in a message, governed by LinkedIn's own terms.",
            },
          ],
        },
        {
          kind: "p",
          content:
            "We do not knowingly collect any special categories of data (such as health or religious information). Please avoid including this type of information in your messages unless it is directly relevant to your request.",
        },
      ],
    },
    {
      heading: "4. Why we process this data",
      blocks: [
        {
          kind: "list",
          items: [
            "To respond to your inquiry and determine whether and how NSR Mallorca can help — based on the steps you take to reach us, and our legitimate interest in responding.",
            "To provide our services, if you go on to become a client — based on the performance of our agreement with you.",
            "To meet legal or tax obligations, where applicable — based on legal obligation.",
          ],
        },
      ],
    },
    {
      heading: "5. How long we keep it",
      blocks: [
        {
          kind: "p",
          content:
            "We keep your data only as long as needed to respond to your inquiry, or, for clients, for the duration of our engagement plus any period required by legal, tax or accounting rules. If an inquiry doesn't lead to an engagement, we delete the related data within [X months — to confirm] of our last contact.",
        },
      ],
    },
    {
      heading: "6. Who we share it with",
      blocks: [
        {
          kind: "p",
          bold: true,
          content: "We do not sell personal data. It may be shared with:",
        },
        {
          kind: "list",
          items: [
            "WhatsApp/Meta, or our email provider, simply as the channel the conversation takes place on.",
            "Professionals we coordinate with on your behalf (e.g. lawyers, gestors, real estate agents) — only where relevant to your matter, and with your knowledge where appropriate.",
            "Public authorities, where required by law.",
          ],
        },
      ],
    },
    {
      heading: "7. About WhatsApp",
      blocks: [
        {
          kind: "p",
          content:
            "WhatsApp is operated by Meta and has its own privacy policy governing how it handles data on its platform (message delivery, metadata, storage, etc.) — see WhatsApp's Privacy Policy at whatsapp.com/legal/privacy-policy. NSR Mallorca is responsible only for the content and use of the conversation itself, not for how WhatsApp/Meta operates its platform.",
        },
      ],
    },
    {
      heading: "8. International transfers",
      blocks: [
        {
          kind: "p",
          content:
            "NSR Mallorca works with clients based outside the European Economic Area (for example, in the UK or Ukraine). Where your data is processed or accessed from outside the EEA, we take reasonable steps to ensure an adequate level of protection — for example, through the European Commission's Standard Contractual Clauses.",
        },
      ],
    },
    {
      heading: "9. Your rights",
      blocks: [
        {
          kind: "p",
          content: {
            text: "Under the GDPR, you have the right to access, correct, delete, or restrict the use of your data, object to processing based on legitimate interest, request data portability, and withdraw consent at any time where processing relies on it. To exercise any of these rights, contact us at ",
            linkText: "contact@nsrmallorca.com",
            linkHref: "mailto:contact@nsrmallorca.com",
            after: ".",
          },
        },
        {
          kind: "p",
          content: {
            text: "You also have the right to lodge a complaint with the Spanish Data Protection Agency (Agencia Española de Protección de Datos, ",
            linkText: "www.aepd.es",
            linkHref: "http://www.aepd.es",
            after: ") or your local supervisory authority.",
          },
        },
      ],
    },
    {
      heading: "10. Cookies",
      blocks: [
        {
          kind: "p",
          content: {
            text: "This website uses cookies, including Google Analytics, to help us understand how visitors use the site. See our ",
            linkText: "Cookie Policy",
            linkHref: "/cookie-policy",
            after:
              " for full details on what is used and how to manage your preferences.",
          },
        },
      ],
    },
  ] as PrivacySection[],
};

type CookiePolicyParagraph =
  | string
  | { text: string; linkText: string; linkHref: string };

type CookiePolicySection = {
  heading: string;
  paragraphs: CookiePolicyParagraph[];
};

export const cookiePolicy = {
  title: "Cookie Policy — NSR Mallorca",
  lastUpdated: "September 2026",
  sections: [
    {
      heading: "What are cookies",
      paragraphs: [
        "Cookies are small text files stored on your device when you visit a website. They help the website function correctly and, where used, help us understand how visitors interact with the site.",
      ],
    },
    {
      heading: "Cookies used on this website",
      paragraphs: [
        "This website uses two types of cookies. First, strictly necessary cookies, which are required for the website to function correctly — for example, remembering your cookie preferences. These are set by NSR Mallorca or our hosting provider and cannot be disabled, as the site would not work properly without them.",
        "Second, analytics cookies from Google Analytics, which help us understand how many people visit the site, which pages they view, and how they found us, in aggregate form. These are set by Google and can be disabled at any time — see below for how.",
      ],
    },
    {
      heading: "About Google Analytics",
      paragraphs: [
        "This website uses Google Analytics, a web analytics service provided by Google. Google Analytics uses cookies to collect information such as pages visited, time spent on the site, general location at country or city level, device and browser type, and how you arrived at the site — for example, through a search engine or a direct link. This information is processed by Google on our behalf and helps us understand and improve the website. We do not use it to identify you personally.",
        {
          text: "Google may process this data on servers outside the European Economic Area. Google provides safeguards for this under the EU Standard Contractual Clauses. You can read more in Google's Privacy Policy at policies.google.com/privacy, and in Google's explanation of how it uses data from sites that use its services at ",
          linkText: "policies.google.com/technologies/partner-sites.",
          linkHref: "https://policies.google.com/technologies/partner-sites",
        },
      ],
    },
    {
      heading: "Managing your cookie preferences",
      paragraphs: [
        {
          text: "When you first visit this website, you will see a cookie banner asking you to accept or reject non-essential cookies, such as Google Analytics. You can change your choice at any time through the cookie settings link in the footer. You can also block or delete cookies directly through your browser settings, or opt out of Google Analytics specifically using Google's Analytics Opt-out Browser Add-on, available at ",
          linkText: "tools.google.com/dlpage/gaoptout.",
          linkHref: "https://tools.google.com/dlpage/gaoptout",
        },
      ],
    },
    {
      heading: "Third-party cookies",
      paragraphs: [
        "Google Analytics is a third-party service with its own privacy practices, separate from NSR Mallorca's. We encourage you to review Google's own privacy policy for full details on how it handles data.",
      ],
    },
  ] satisfies CookiePolicySection[],
};
