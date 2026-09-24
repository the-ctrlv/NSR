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
import { serviceAreas, siteConfig } from "@/lib/content";

// Per the final approved SEO Developer Brief (section 7): real service
// names and verified facts only — no SEO-keyword arrays, and none of the
// explicitly excluded entities (Property Management, Legal Services, Tax
// Services, Business Compliance, Construction Management). No FAQPage
// entity either — the brief explicitly says not to (Google dropped the FAQ
// rich-result snippet).
const areaServed = serviceAreas.map((name) => ({ "@type": "Place", name }));
const organizationId = `${siteConfig.url}/#organization`;
const founderId = `${siteConfig.url}/#founder`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: `${siteConfig.url}/icons/logo.svg`,
      email: "contact@nsrmallorca.com",
      telephone: "+34656356628",
      areaServed,
      availableLanguage: ["English", "Spanish", "Russian", "Ukrainian"],
      founder: { "@id": founderId },
    },
    {
      "@type": "Person",
      "@id": founderId,
      name: "Nataliia Sychenko Romanova",
      jobTitle: "Founder, NSR Mallorca",
      image: `${siteConfig.url}/images/portrait-founder.jpg`,
      sameAs: ["https://www.linkedin.com/in/nataliia-sychenko-romanova/"],
      worksFor: { "@id": organizationId },
    },
    ...[
      "Private Client Services",
      "Local Representation",
      "Property Project Coordination",
      "Family Relocation Coordination",
      "Local Business Support",
    ].map((name) => ({
      "@type": "Service",
      name,
      provider: { "@id": organizationId },
      areaServed,
    })),
  ],
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
