import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { workingTogether } from "@/lib/content";

const numerals: Record<string, string> = {
  "01": "/icons/numeral-01-big.svg",
  "02": "/icons/numeral-02-big.svg",
};

export function WorkingTogether() {
  return (
    <section
      className="bg-paper py-20 h-screen text-alabaster bg-[url('/images/blurred-wt.jpg')] bg-cover bg-center bg-no-repeat"
      aria-labelledby="working-heading"
    >
      <Container className="relative flex flex-col justify-between h-full">
        <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide">
            <span aria-hidden="true">→</span>
            {workingTogether.eyebrow}
          </p>
          <h2
            id="working-heading"
            className="max-w-[401px] font-sans text-base leading-[1.4] lg:text-right lg:text-[16px]"
          >
            {workingTogether.heading}
          </h2>
        </div>

        <Reveal
          as="ul"
          stagger={0.15}
          className="grid grid-cols-1 border-y border-hairline/10 sm:grid-cols-2"
        >
          {workingTogether.models.map((model) => (
            <li
              key={model.index}
              className="relative flex flex-col justify-end items-start gap-6 overflow-hidden border-b border-hairline/10 px-4 py-7 last:border-b-0 sm:border-b-0 sm:border-r sm:px-8 sm:last:border-r-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector numeral */}
              <div className="w-full flex justify-end">
                <img
                  src={numerals[model.index]}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none h-[200px] block select-none  sm:right-8 sm:top-8"
                />
              </div>
              <div className="relative max-w-[440px]">
                <h3 className="font-serif text-[32px] leading-[1.2] sm:text-4xl lg:text-[48px]">
                  {model.title}
                </h3>
                <p className="mt-5 font-sans text-[15px] font-medium leading-[1.4]">
                  {model.body}
                </p>
              </div>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
