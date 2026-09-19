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

function PolicyList({
  items,
}: {
  items: (typeof privacyPolicy.sections)[number]["list"];
}) {
  if (!items) return null;
  return (
    <ul className="flex list-disc flex-col gap-1 font-sans text-[15px] leading-[1.4] text-ink/70">
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
          <Reveal className="flex flex-col gap-8 sm:gap-10 max-w-[900px] mx-auto">
            <h1 className="font-serif text-4xl uppercase leading-[1.2] text-ink sm:text-h2 sm:leading-[1.3]">
              {privacyPolicy.title}
            </h1>

            <div className="flex max-w-[900px] flex-col gap-2 font-sans text-[15px] leading-[1.4] text-ink/70">
              {privacyPolicy.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="flex max-w-[900px] flex-col gap-8 sm:gap-10">
              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-[28px] leading-none text-ink sm:text-line">
                  {privacyPolicy.scope.heading}
                </h2>
                <p className="font-sans text-[15px] font-medium leading-[1.4] text-ink">
                  {privacyPolicy.scope.body}
                </p>
              </div>

              {privacyPolicy.sections.map((section, index) => {
                const isSubsection = index < 3;
                return (
                  <div key={section.heading} className="flex flex-col gap-2">
                    <h3
                      className={`font-serif leading-[1.1] text-ink ${
                        isSubsection
                          ? "text-xl sm:text-2xl"
                          : "text-2xl sm:text-[28px]"
                      }`}
                    >
                      {section.heading}
                    </h3>
                    {section.body && (
                      <p className="font-sans text-[15px] leading-[1.4] text-ink/70">
                        {section.body}
                      </p>
                    )}
                    <PolicyList items={section.list} />
                    {section.after && (
                      <p className="font-sans text-[15px] leading-[1.4] text-ink/70">
                        {section.after}
                      </p>
                    )}
                  </div>
                );
              })}

              <div className="flex gap-5 border-l border-hairline py-6 pl-5">
                <p className="font-sans text-[15px] leading-[1.4] text-ink">
                  &ldquo;{privacyPolicy.quote}&rdquo;
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
