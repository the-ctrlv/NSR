import { SequentialFlowReveal } from "@/components/animations/SequentialFlowReveal";
import { TextFillReveal } from "@/components/animations/TextFillReveal";
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
        <Eyebrow className="mb-20">{solution.eyebrow}</Eyebrow>

        <div className="grid gap-10 lg:grid-cols-[1fr_383px] lg:gap-16">
          <TextFillReveal
            id="solution-heading"
            lines={solution.heading}
            className="font-serif text-4xl leading-[1.1] text-ink sm:text-h2"
          />
          <div className="flex flex-col gap-3 pt-4">
            <p className="font-serif text-lg leading-[1.3] text-ink lg:text-[22px]">
              {solution.paragraphs[0]}
            </p>
            <p className="font-sans text-base leading-[1.4] text-ink/80">
              {solution.paragraphs[1]}
            </p>
          </div>
        </div>

        <SequentialFlowReveal
          start="top 95%"
          className="mt-32 flex flex-col items-start justify-between gap-6 sm:flex-row sm:flex-wrap sm:gap-x-8 lg:gap-x-12"
        >
          {solution.flow.map((step, i) => (
            <div
              key={step}
              className={`flex flex-col items-center gap-3 sm:flex-row ${
                i === solution.flow.length - 1
                  ? "lg:flex-col lg:items-start"
                  : ""
              }`}
            >
              <span
                className={`font-serif text-4xl leading-none text-ink sm:text-5xl lg:text-[64px] ${
                  step === "NSR Mallorca" ? "uppercase" : ""
                }`}
                data-flow-text
              >
                {step}
              </span>
              {i < solution.flow.length - 1 && (
                <img
                  src="/icons/arrow.svg"
                  alt=""
                  aria-hidden="true"
                  data-flow-arrow
                  className="h-auto w-[88px]"
                />
              )}
              {i === solution.flow.length - 1 && (
                <ul
                  data-flow-list
                  className="w-full list-none pl-0 text-center font-sans text-base leading-[2] text-ink/80 lg:w-[383px] lg:list-disc lg:pl-5 lg:text-left lg:leading-[1.6]"
                >
                  {solution.professionals.map((professional) => (
                    <li key={professional}>{professional}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </SequentialFlowReveal>
      </Container>
    </section>
  );
}
