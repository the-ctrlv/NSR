import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { cookiePolicy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cookie Policy",
  alternates: { canonical: "/cookie-policy" },
};

function SectionParagraph({
  paragraph,
}: {
  paragraph: (typeof cookiePolicy.sections)[number]["paragraphs"][number];
}) {
  if (typeof paragraph === "string") {
    return (
      <p className="font-sans text-[15px] leading-[1.4] text-ink/70">
        {paragraph}
      </p>
    );
  }
  return (
    <p className="font-sans text-[15px] leading-[1.4] text-ink/70">
      {paragraph.text}
      <a
        href={paragraph.linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-ink underline decoration-from-font underline-offset-2"
      >
        {paragraph.linkText}
      </a>
    </p>
  );
}

export default function CookiePolicyPage() {
  return (
    <>
      <PageHeader />
      <main className="bg-paper">
        <Container as="section" className="pt-16 pb-20 sm:pt-20 lg:pt-24 lg:pb-24">
          <Reveal className="flex flex-col gap-8 sm:gap-10">
            <h1 className="font-serif text-4xl uppercase leading-[1.2] text-ink sm:text-h2 sm:leading-[1.3]">
              {cookiePolicy.title}
            </h1>

            <div className="flex max-w-[900px] flex-col gap-8 sm:gap-10">
              <p className="font-serif text-2xl leading-[1.1] text-ink sm:text-[28px]">
                Last updated: {cookiePolicy.lastUpdated}
              </p>

              {cookiePolicy.sections.map((section) => (
                <div key={section.heading} className="flex flex-col gap-2">
                  <h2 className="font-serif text-2xl leading-[1.1] text-ink sm:text-[28px]">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph, i) => (
                    <SectionParagraph
                      key={typeof paragraph === "string" ? paragraph : i}
                      paragraph={paragraph}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
