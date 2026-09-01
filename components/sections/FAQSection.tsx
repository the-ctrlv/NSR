import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { faq } from "@/lib/content";

export function FAQSection() {
  return (
    <section id="faq" className="bg-paper py-24 lg:py-32" aria-labelledby="faq-heading">
      <Container className="grid gap-12 lg:grid-cols-[459px_1fr] lg:gap-16">
        <div>
          <Eyebrow className="mb-6">{faq.eyebrow}</Eyebrow>
          <h2 id="faq-heading" className="font-serif text-3xl leading-[1.2] text-ink sm:text-4xl">
            {faq.heading}
          </h2>
        </div>

        <Reveal as="div" stagger={0.08} className="flex flex-col divide-y divide-hairline border-t border-hairline">
          {faq.items.map((item) => (
            <details key={item.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-lg leading-[1.3] text-ink sm:text-xl">
                {item.question}
                <span
                  aria-hidden="true"
                  className="relative h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-45"
                >
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-ink" />
                  <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink" />
                </span>
              </summary>
              <p className="mt-4 max-w-[560px] font-sans text-[15px] leading-[1.5] text-ink/80">{item.answer}</p>
            </details>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
