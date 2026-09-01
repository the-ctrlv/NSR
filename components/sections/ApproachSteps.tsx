import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { approach, approachSteps } from "@/lib/content";

export function ApproachSteps() {
  return (
    <section id="approach" className="bg-paper py-24 lg:py-32" aria-labelledby="approach-heading">
      <Container className="grid gap-12 lg:grid-cols-[448px_1fr] lg:gap-10">
        <div>
          <Eyebrow className="mb-6">{approach.eyebrow}</Eyebrow>
          <h2 id="approach-heading" className="font-serif text-4xl leading-[1.1] text-ink sm:text-h2">
            {approach.heading}
          </h2>
        </div>

        <Reveal as="ol" stagger={0.15} className="flex flex-col divide-y divide-hairline border-t border-hairline">
          {approachSteps.map((step) => (
            <li key={step.number} className="grid grid-cols-[64px_1fr] items-start gap-6 py-8 sm:grid-cols-[120px_1fr] sm:gap-10 sm:py-10">
              <span className="font-serif text-4xl leading-none text-ink/20 sm:text-6xl lg:text-7xl" aria-hidden="true">
                {step.number}
              </span>
              <div>
                <h3 className="font-serif text-xl leading-[1.2] text-ink sm:text-2xl">{step.title}</h3>
                <p className="mt-3 max-w-[546px] font-sans text-[15px] leading-[1.5] text-ink/80">{step.body}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
