import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { workingTogether } from "@/lib/content";

export function WorkingTogether() {
  return (
    <section className="bg-ink py-24 text-alabaster lg:py-32" aria-labelledby="working-heading">
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
            <span aria-hidden="true">→</span>
            {workingTogether.eyebrow}
          </p>
          <h2 id="working-heading" className="max-w-[401px] font-serif text-2xl leading-[1.3] lg:text-right">
            {workingTogether.heading}
          </h2>
        </div>

        <Reveal
          as="ul"
          stagger={0.15}
          className="grid grid-cols-1 gap-px border-t border-alabaster/15 bg-alabaster/15 sm:grid-cols-2"
        >
          {workingTogether.models.map((model) => (
            <li key={model.index} className="relative flex flex-col justify-end gap-6 overflow-hidden bg-ink px-8 py-16 lg:py-24">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 right-4 select-none font-serif text-[9rem] leading-none text-alabaster/[0.06] sm:text-[11rem]"
              >
                {model.index}
              </span>
              <div className="relative max-w-[440px]">
                <h3 className="font-serif text-3xl leading-[1.15] sm:text-4xl">{model.title}</h3>
                <p className="mt-5 font-sans text-[15px] leading-[1.5] text-alabaster/80">{model.body}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
