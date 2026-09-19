import { SequentialFlowReveal } from "@/components/animations/SequentialFlowReveal";
import { TextFillReveal } from "@/components/animations/TextFillReveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { solution } from "@/lib/content";

export function SolutionDiagram() {
  return (
    <section
      id="about"
      className="bg-paper pt-20 pb-16 lg:pb-20"
      aria-labelledby="solution-heading"
    >
      <Container className="max-sm:!px-4">
        <Eyebrow className="mb-8 lg:mb-20">{solution.eyebrow}</Eyebrow>

        <div className="grid gap-5 lg:grid-cols-[1fr_383px] lg:gap-16">
          <TextFillReveal
            id="solution-heading"
            lines={solution.heading}
            className="text-3xl font-serif md:text-4xl leading-[1.1] text-ink sm:text-h2"
          />
          <div className="flex flex-col gap-2 pt-0 lg:gap-3 lg:pt-4">
            <p className="font-serif text-lg leading-[1.3] text-ink sm:text-xl lg:text-[22px]">
              {solution.paragraphs[0]
                .split("one person")
                .map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className="uppercase">one person</span>
                    )}
                  </span>
                ))}
            </p>
            <p className="font-sans text-base leading-[1.4] text-ink/80 sm:text-lg">
              {solution.paragraphs[1]}
            </p>
          </div>
        </div>

        <SequentialFlowReveal
          start="top 180%"
          duration={0.3}
          pause={0.05}
          className="mt-10 flex flex-col items-center gap-6 sm:gap-10 lg:mt-32 lg:flex-row lg:flex-nowrap lg:items-start lg:justify-center lg:gap-x-6 xl:gap-x-12"
        >
          {solution.flow.map((step, i) => (
            <div
              key={step}
              className={`flex flex-col items-center ${
                i === solution.flow.length - 1 ? "gap-2" : "gap-6"
              } lg:flex-row lg:!gap-4 xl:!gap-12 ${
                i === solution.flow.length - 1
                  ? "lg:!flex-col lg:items-start"
                  : ""
              }`}
            >
              <span
                className={`font-serif text-4xl leading-none text-ink sm:text-6xl lg:text-4xl xl:text-[64px] ${
                  step === "NSR Mallorca" ? "uppercase" : ""
                }`}
                data-flow-text
              >
                {step}
              </span>
              {i < solution.flow.length - 1 && (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center sm:h-24 sm:w-24 lg:h-auto lg:w-12 xl:w-[88px]">
                  <img
                    src="/icons/arrow.svg"
                    alt=""
                    aria-hidden="true"
                    data-flow-arrow
                    className="h-auto w-16 rotate-90 sm:w-24 lg:w-12 lg:rotate-0 xl:w-[88px]"
                  />
                </div>
              )}
              {i === solution.flow.length - 1 && (
                <ul
                  data-flow-list
                  className="w-full list-none pl-0 text-center font-sans text-base leading-[2] text-ink/80 sm:text-lg lg:w-[260px] lg:list-disc lg:pl-5 lg:text-left lg:leading-[1.6] lg:text-sm xl:w-[383px] xl:text-lg"
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
