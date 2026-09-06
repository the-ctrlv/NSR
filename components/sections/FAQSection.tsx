import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faq } from "@/lib/content";

export function FAQSection() {
  return (
    <section id="faq" className="bg-paper py-20" aria-labelledby="faq-heading">
      <Container>
        <Eyebrow className="mb-6">{faq.eyebrow}</Eyebrow>
        <div className="grid gap-12 lg:grid-cols-[459px_1fr] lg:gap-55 mt-15">
          <h2
            id="faq-heading"
            className="font-serif text-4xl leading-[1.1] text-ink sm:text-5xl lg:text-[56px]"
          >
            {faq.heading}
          </h2>
          <Reveal
            as="div"
            stagger={0.08}
            className="flex flex-col divide-y divide-alabaster border-alabaster"
          >
            {faq.items.map((item, i) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl leading-[1.5] text-ink lg:text-[22px]">
                  <span>
                    {String(i + 1).padStart(2, "0")} - {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className="block h-[11px] w-[11px] shrink-0 transition-transform duration-300 group-open:rotate-45"
                  >
                    <img
                      src="/icons/arrow-diagonal.svg"
                      alt=""
                      className="h-full w-full"
                    />
                  </span>
                </summary>
                <p className="mt-3 max-w-[620px] font-sans text-base leading-[1.4] text-ink/80">
                  {item.answer}
                </p>
              </details>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
