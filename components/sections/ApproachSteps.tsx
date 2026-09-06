import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { approach, approachSteps } from "@/lib/content";

export function ApproachSteps() {
  return (
    <section
      className="bg-paper-dim py-20 text-ink lg:py-20"
      aria-labelledby="categories-heading"
    >
      <Container>
        <div className="grid gap-16 lg:grid-cols-[505px_1fr] lg:gap-20">
          <div>
            <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
              <span aria-hidden="true">→</span>
              {approach.eyebrow}
            </p>
            <h2
              id="categories-heading"
              className="mt-24 max-w-[505px] font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-[56px]"
            >
              Different situations.
              <br />
              One operational approach.
            </h2>
          </div>

          <Reveal as="div" stagger={0.12} className="flex flex-col">
            {approachSteps.map((step, index) => (
              <article
                key={step.number}
                className="relative overflow-hidden border-b border-hairline"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- exported numeral artwork */}
                {/* eslint-disable-next-line @next/next/no-img-element -- exported numeral artwork */}
                <img
                  src={`/icons/numeral-${step.number}.svg`}
                  alt=""
                  aria-hidden="true"
                  className={`block translate-x-2 absolute -left-2 top-11 h-auto ${index === 0 ? "w-[122px] translate-y-2" : "w-40 translate-y-3"}`}
                />
                {/* <img
                  src={numerals[step.number]}
                  alt=""
                  aria-hidden="true"
                  className=" opacity-15"
                /> */}
                <div className="relative ml-50 flex max-w-[546px] flex-col gap-1 pt-[70px]">
                  <h3 className="font-serif text-xl leading-none lg:text-2xl">
                    {step.title}
                  </h3>
                  <p className="font-sans text-[15px] leading-[1.5] text-ink/80 mb-2">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
