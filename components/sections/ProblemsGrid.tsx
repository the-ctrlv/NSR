"use client";

import { Reveal } from "@/components/animations/Reveal";
import { TextFillReveal } from "@/components/animations/TextFillReveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { problemCards } from "@/lib/content";

const iconSrc: Record<(typeof problemCards)[number]["icon"], string> = {
  starburst: "/icons/icon-starburst.svg",
  mesh: "/icons/icon-mesh.svg",
  waves: "/icons/icon-wave-5.svg",
  lines: "/icons/icon-wave-6.svg",
};

export function ProblemsGrid() {
  return (
    <section
      id="matters"
      className="bg-paper pt-20 pb-16 sm:py-20"
      aria-labelledby="problems-heading"
    >
      <Container className="flex flex-col sm:flex-row sm:justify-between max-sm:!px-4">
        <div>
          <Eyebrow className="mb-8 sm:mb-15">What can I help you solve?</Eyebrow>
          <TextFillReveal
            id="problems-heading"
            lines={["Complex local", "matters can look", "like this"]}
            className="font-serif text-[42px] leading-[1.1] text-ink sm:text-h2 max-w-md"
          />
        </div>

        <Reveal
          as="ul"
          stagger={0.42}
          className="grid grid-cols-1 border-y max-w-[745px] border-hairline sm:grid-cols-2 mt-8 sm:mt-12"
        >
          {problemCards.map((card, index) => {
            const isLastMobile = index === problemCards.length - 1;
            const isTopRowDesktop = index < 2;
            const isLeftColDesktop = index % 2 === 0;
            return (
              <li
                key={card.title.join(" ")}
                className={`flex flex-col gap-8 sm:gap-12 border-hairline bg-paper px-0 py-6 sm:px-6 sm:py-8 ${
                  isLastMobile ? "" : "border-b"
                } sm:border-b-0 ${isTopRowDesktop ? "sm:!border-b" : ""} ${
                  isLeftColDesktop ? "sm:border-r" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-5">
                  <h3 className="min-w-0 font-serif text-2xl leading-[1.2] text-ink">
                    {card.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                  {/* eslint-disable-next-line @next/next/no-img-element -- small decorative vector icon */}
                  <img
                    src={iconSrc[card.icon]}
                    alt=""
                    aria-hidden="true"
                    className="h-20 w-20 shrink-0"
                  />
                </div>
                <p className="font-sans text-[15px] leading-[1.4] text-ink/80">
                  {card.body}
                </p>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
