import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Sparkle } from "@/components/icons/CategoryIcons";
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
          className="mt-24 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8 lg:gap-12"
        >
          {solution.flow.map((step, i) => (
            <div key={step} className="flex items-center gap-6 sm:gap-8 lg:gap-12">
              <span
                className={`font-serif text-3xl sm:text-4xl lg:text-5xl ${
                  step === "NSR Mallorca" ? "text-ink" : "text-ink/50"
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

        <div className="mt-16 flex flex-wrap justify-center gap-x-3 gap-y-2 border-t border-hairline pt-10 lg:justify-end">
          {solution.professionals.map((p, i) => (
            <span key={p} className="flex items-center gap-3 font-sans text-sm text-ink/80">
              {p}
              {i < solution.professionals.length - 1 && (
                <Sparkle className="h-2 w-2 text-ink/40" />
              )}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
