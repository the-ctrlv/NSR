"use client";

import { useState } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { TextFillReveal } from "@/components/animations/TextFillReveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faq } from "@/lib/content";

export function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <section
      id="faq"
      // Plain fixed padding, matching every other section — deliberately
      // not flex/justify-content centering: that recomputes symmetrically
      // whenever the content's height changes, so opening an accordion item
      // would push the eyebrow/heading up along with the answer text
      // growing down. A static offset never moves the top edge; only the
      // space below (and the section's own height) grows when an item
      // opens.
      className="bg-paper py-20 lg:py-20"
      aria-labelledby="faq-heading"
    >
      <Container>
        <Eyebrow className="mb-6">{faq.eyebrow}</Eyebrow>
        <div className="grid gap-12 lg:grid-cols-[340px_1fr] lg:gap-16 xl:grid-cols-[459px_1fr] xl:gap-55 mt-15">
          <TextFillReveal
            id="faq-heading"
            lines={faq.heading}
            className="font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-[56px]"
          />
          <Reveal
            as="div"
            stagger={0.08}
            className="flex flex-col divide-y divide-alabaster border-alabaster"
          >
            {faq.items.map((item, i) => {
              const isOpen = openItems.has(i);
              return (
                <div key={item.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 text-left font-serif text-xl leading-[1.5] text-ink lg:text-[22px]"
                  >
                    <span>
                      {String(i + 1).padStart(2, "0")} - {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`block h-[11px] w-[11px] shrink-0 transition-transform duration-300 ${
                        isOpen ? "-rotate-405" : ""
                      }`}
                    >
                      <img
                        src="/icons/arrow-diagonal.svg"
                        alt=""
                        className="h-full w-full"
                      />
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="mt-3 max-w-[620px] font-sans text-base leading-[1.4] text-ink/80">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
