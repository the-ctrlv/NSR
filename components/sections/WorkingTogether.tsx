import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { workingTogether } from "@/lib/content";

const numerals: Record<string, string> = {
  "01": "/icons/numeral-01.svg",
  "02": "/icons/numeral-02.svg",
};

export function WorkingTogether() {
  return (
    <section className="relative isolate overflow-hidden bg-[#768593] py-24 text-alabaster lg:py-32" aria-labelledby="working-heading">
      <Image
        src="/images/working-bg-2.png"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-70 blur-sm"
      />
      <div className="absolute inset-0 bg-ink/50" />
      <GrainOverlay className="opacity-[0.15] mix-blend-soft-light" />

      <Container className="relative">
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
          className="grid grid-cols-1 gap-px border-t border-alabaster/10 bg-alabaster/10 sm:grid-cols-2"
        >
          {workingTogether.models.map((model) => (
            <li key={model.index} className="relative flex flex-col justify-end gap-6 overflow-hidden bg-transparent px-8 py-16 lg:py-24">
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector numeral */}
              <img
                src={numerals[model.index]}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute right-8 top-8 h-auto w-40 select-none opacity-90 sm:w-52"
              />
              <div className="relative max-w-[440px]">
                <h3 className="font-serif text-3xl leading-[1.2] sm:text-4xl lg:text-[48px]">{model.title}</h3>
                <p className="mt-5 font-sans text-[15px] font-medium leading-[1.4] text-alabaster">{model.body}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
