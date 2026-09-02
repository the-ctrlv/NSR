import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { solution } from "@/lib/content";

export function SolutionDiagram() {
  return (
    <section
      id="about"
      className="bg-paper py-20"
      aria-labelledby="solution-heading"
    >
      <Container>
        <Eyebrow className="mb-6">{solution.eyebrow}</Eyebrow>

        <div className="grid gap-10 lg:grid-cols-[1fr_383px] lg:gap-16">
          <h2
            id="solution-heading"
            className="font-serif text-4xl leading-[1.1] text-ink sm:text-h2"
          >
            {solution.heading.map((line, i) => (
              <span key={line}>
                {line}{" "}
                {i < solution.heading.length - 1 && (
                  <br className="hidden lg:block" />
                )}
              </span>
            ))}
          </h2>
          <div className="flex flex-col gap-3">
            <p className="font-serif text-lg leading-[1.3] text-ink lg:text-[22px]">
              {solution.paragraphs[0]}
            </p>
            <p className="font-sans text-base leading-[1.4] text-ink/80">
              {solution.paragraphs[1]}
            </p>
          </div>
        </div>

        <Reveal
          stagger={0.15}
          className="mt-24 flex flex-col items-center justify-center gap-6 sm:flex-row sm:flex-wrap sm:gap-x-8 lg:gap-x-12"
        >
          {solution.flow.map((step, i) => (
            <div
              key={step}
              className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8 lg:gap-12"
            >
              <span
                className={`font-serif text-4xl leading-none text-ink sm:text-5xl lg:text-[64px] ${
                  step === "NSR Mallorca" ? "uppercase" : ""
                }`}
              >
                {step}
              </span>
              {i < solution.flow.length - 1 && (
                <span
                  aria-hidden="true"
                  className="h-10 w-px bg-hairline sm:h-px sm:w-16 lg:w-[88px]"
                />
              )}
            </div>
          ))}
        </Reveal>

        <div className="mt-16 border-t border-hairline pt-10 lg:flex lg:justify-end">
          <ul className="w-full list-none pl-0 text-center font-sans text-base leading-[2] text-ink/80 lg:w-[383px] lg:list-disc lg:pl-5 lg:text-left lg:leading-[1.6]">
            {solution.professionals.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
