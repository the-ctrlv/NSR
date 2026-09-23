import { Hero } from "@/components/sections/Hero";
import { ProblemsGrid } from "@/components/sections/ProblemsGrid";
import { RealityReveal } from "@/components/sections/RealityReveal";
import { SolutionDiagram } from "@/components/sections/SolutionDiagram";
import { AboutFounder } from "@/components/sections/AboutFounder";
import { ApproachSteps } from "@/components/sections/ApproachSteps";
import { ServiceCategories } from "@/components/sections/ServiceCategories";
import { PracticeCases } from "@/components/sections/PracticeCases";
import { WorkingTogether } from "@/components/sections/WorkingTogether";
import { FAQSection } from "@/components/sections/FAQSection";
import { ClosingCta } from "@/components/sections/ClosingCta";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingCta } from "@/components/layout/FloatingCta";
import { StickyHeader } from "@/components/layout/StickyHeader";
import { faq, serviceAreas, siteConfig } from "@/lib/content";

// No unsupported services here — states only what's actually on the page.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  areaServed: serviceAreas.map((name) => ({
    "@type": "Place",
    name,
  })),
  founder: {
    "@type": "Person",
    name: "Nataliia Sychenko Romanova",
  },
};

// FAQPage — Google dropped the FAQ rich-result snippet in the SERPs, but
// the markup itself is otherwise harmless and mirrors FAQSection.tsx's own
// questions/answers exactly (never diverges from what's visibly on the
// page).
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div id="top">
        <Hero />
        <main>
          <ProblemsGrid />
          <RealityReveal />
          <SolutionDiagram />
          <AboutFounder />
          <ApproachSteps />
          <ServiceCategories />
          <PracticeCases />
          <WorkingTogether />
          <FAQSection />
          <ClosingCta />
        </main>
        <SiteFooter />
      </div>
      <FloatingCta />
      <StickyHeader />
    </>
  );
}
