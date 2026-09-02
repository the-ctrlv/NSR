import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { practiceCases } from "@/lib/content";

export function PracticeCases() {
  return (
    <section className="bg-paper py-24 lg:py-32" aria-label="NSR in practice">
      <Container>
        <Eyebrow className="mb-10 lg:mb-16">{practiceCases.eyebrow}</Eyebrow>

        <Reveal as="ul" stagger={0.15} className="flex flex-col gap-6">
          {practiceCases.cases.map((item) => (
            <li
              key={item.title}
              className="relative isolate overflow-hidden border border-hairline bg-paper px-4 pb-4 pt-10 lg:min-h-[540px] lg:p-20"
            >
              <GrainOverlay className="opacity-[0.08] mix-blend-overlay" />
              <div className="relative grid gap-8 lg:grid-cols-[370px_1fr] lg:gap-16">
                <h3 className="font-serif text-[32px] leading-[1.1] text-ink lg:text-[48px]">{item.title}</h3>

                <div className="flex flex-col gap-10 lg:gap-14">
                  <p className="font-serif text-base leading-[1.2] text-ink lg:text-2xl">{item.intro}</p>

                  <div className="flex flex-col gap-5 sm:flex-row sm:gap-5">
                    <p className="font-serif text-lg leading-none text-ink sm:w-[100px] sm:shrink-0">
                      {item.roleLabel}
                    </p>
                    <div className="flex flex-col gap-3 border-hairline pl-0 font-sans text-[15px] leading-[1.5] text-ink sm:border-l sm:pl-5">
                      {"lead" in item && item.lead && (
                        <p className="font-semibold">{item.lead}</p>
                      )}
                      {"list" in item && item.list && (
                        <ul className="list-disc pl-5 text-ink">
                          {item.list.map((point) => (
                            <li key={point}>{point}</li>
                          ))}
                        </ul>
                      )}
                      {"paragraphs" in item && item.paragraphs && (
                        <div className="flex flex-col gap-3 text-ink/80">
                          {item.paragraphs.map((p) => (
                            <p key={p}>{p}</p>
                          ))}
                        </div>
                      )}
                      {"body" in item && item.body && <p className="text-ink/80">{item.body}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <p className="relative mt-10 font-serif text-lg uppercase text-ink lg:absolute lg:bottom-20 lg:left-20 lg:mt-0">
                {item.counter}
              </p>
            </li>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
