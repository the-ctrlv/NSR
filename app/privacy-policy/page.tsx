import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { privacyPolicy } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy-policy" },
};

type Section = (typeof privacyPolicy.sections)[number];
type Block = Section["blocks"][number];
type ListItems = Extract<Block, { kind: "list" }>["items"];

function Paragraph({ block }: { block: Extract<Block, { kind: "p" }> }) {
  const baseClass = `font-sans text-[15px] leading-[1.4] ${
    block.bold ? "font-semibold text-ink" : "text-ink/70"
  }`;
  if (typeof block.content === "string") {
    return <p className={baseClass}>{block.content}</p>;
  }
  const { text, linkText, linkHref, after } = block.content;
  return (
    <p className={baseClass}>
      {text}
      <a
        href={linkHref}
        target={linkHref.startsWith("http") ? "_blank" : undefined}
        rel={linkHref.startsWith("http") ? "noopener noreferrer" : undefined}
        className="font-semibold text-ink underline decoration-from-font underline-offset-2"
      >
        {linkText}
      </a>
      {after}
    </p>
  );
}

function PolicyList({ items }: { items: ListItems }) {
  return (
    <ul className="ml-5 flex list-disc flex-col gap-1 font-sans text-[15px] leading-[1.4] text-ink/70">
      {items.map((item) => {
        const text = typeof item === "string" ? item : item.text;
        const label = typeof item === "string" ? null : item.label;
        const key = typeof item === "string" ? item : item.label;
        return (
          <li key={key}>
            {label && <span className="font-semibold text-ink">{label} </span>}
            {text}
          </li>
        );
      })}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader />
      <main className="bg-paper">
        <Container
          as="section"
          className="pt-16 pb-20 sm:pt-20 lg:pt-24 lg:pb-24"
        >
          <Reveal className="flex flex-col gap-6 max-w-[900px] mx-auto">
            <h1 className="font-serif text-4xl uppercase leading-[1.2] text-ink sm:text-h2 sm:leading-[1.3]">
              {privacyPolicy.title}
            </h1>

            <div className="flex flex-col gap-8 sm:gap-10">
              <div className="flex flex-col gap-2">
                <p className="font-sans font-semibold text-base leading-[1.1] text-ink">
                  Last updated: {privacyPolicy.lastUpdated}
                </p>
                <p className="font-sans text-[15px] leading-[1.4] text-ink/70">
                  {privacyPolicy.intro}
                </p>
              </div>

              {privacyPolicy.sections.map((section) => (
                <div key={section.heading} className="flex flex-col gap-2">
                  <h2 className="font-serif text-2xl leading-[1.1] text-ink sm:text-[28px]">
                    {section.heading}
                  </h2>
                  {section.blocks.map((block, i) =>
                    block.kind === "list" ? (
                      <PolicyList key={i} items={block.items} />
                    ) : (
                      <Paragraph key={i} block={block} />
                    ),
                  )}
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
