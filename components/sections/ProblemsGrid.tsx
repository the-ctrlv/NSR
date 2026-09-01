import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { problemCards } from "@/lib/content";

const iconSrc: Record<(typeof problemCards)[number]["icon"], string> = {
  starburst: "/icons/icon-starburst.svg",
  mesh: "/icons/icon-mesh.svg",
  wave: "/icons/icon-wave-1.svg",
  lines: "/icons/icon-wave-4.svg",
};

export function ProblemsGrid() {
  return (
    <section id="matters" className="bg-paper py-24 lg:py-32" aria-labelledby="problems-heading">
      <Container className="grid gap-12 lg:grid-cols-[448px_1fr] lg:gap-10">
        <div>
          <Eyebrow className="mb-6">What can I help you solve?</Eyebrow>
          <h2 id="problems-heading" className="font-serif text-4xl leading-[1.1] text-ink sm:text-h2">
            Complex local matters can look like this
          </h2>
        </div>

        <Reveal
          as="ul"
          stagger={0.12}
          className="grid grid-cols-1 gap-px border-t border-hairline bg-hairline sm:grid-cols-2"
        >
          {problemCards.map((card) => (
            <li key={card.title.join(" ")} className="flex flex-col gap-12 bg-paper px-0 py-8 sm:px-6">
              <div className="flex items-center justify-between gap-5">
                <h3 className="min-w-0 font-serif text-2xl leading-[1.2] text-ink">
                  {card.title.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                {/* eslint-disable-next-line @next/next/no-img-element -- small decorative vector icon */}
                <img src={iconSrc[card.icon]} alt="" aria-hidden="true" className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
              </div>
              <p className="font-sans text-[15px] leading-[1.4] text-ink/80">{card.body}</p>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
