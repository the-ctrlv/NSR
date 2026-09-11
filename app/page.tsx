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
import { siteConfig } from "@/lib/content";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  areaServed: {
    "@type": "Place",
    name: "Mallorca, Spain",
  },
  founder: {
    "@type": "Person",
    name: "Nataliia Sychenko Romanova",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
