import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { solution } from "@/lib/content";

export function SolutionDiagram() {
  return (
    <section id="about" className="bg-paper py-24 lg:py-32" aria-labelledby="solution-heading">
      <Container>
        <Eyebrow className="mb-6">{solution.eyebrow}</Eyebrow>

        <div className="grid gap-10 lg:grid-cols-[1fr_383px] lg:gap-16">
          <h2 id="solution-heading" className="font-serif text-4xl leading-[1.1] text-ink sm:text-h2">
            {solution.heading.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <div className="flex flex-col gap-8 font-sans text-[15px] leading-[1.6] text-ink/80">
            {solution.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <Reveal
          stagger={0.15}
          className="mt-24 flex flex-row flex-wrap items-center justify-center gap-x-6 gap-y-4 sm:gap-x-8 lg:gap-x-12"
        >
          {solution.flow.map((step, i) => (
            <div key={step} className="flex items-center gap-6 sm:gap-8 lg:gap-12">
              <span
                className={`font-serif text-4xl leading-none text-ink sm:text-5xl lg:text-[64px] ${
                  step === "NSR Mallorca" ? "uppercase" : ""
                }`}
              >
                {step}
              </span>
              {i < solution.flow.length - 1 && (
                <span aria-hidden="true" className="h-px w-10 bg-hairline sm:w-16 lg:w-[88px]" />
              )}
            </div>
          ))}
        </Reveal>

        <div className="mt-16 border-t border-hairline pt-10 lg:flex lg:justify-end">
          <ul className="list-disc pl-5 font-sans text-base leading-[1.6] text-ink/80 lg:w-[383px]">
            {solution.professionals.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
