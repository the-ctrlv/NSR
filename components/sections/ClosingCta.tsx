import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { closingCta } from "@/lib/content";

const { labels, heading, body, cta, contacts } = closingCta;

export function ClosingCta() {
  return (
    <section id="contact" className="relative isolate overflow-hidden bg-ink text-alabaster">
      {/* One gradient spans the whole section (not just the portrait column) so there's no seam where a separately-sized layer would end. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60vw 90vh at 21% 38%, #9aacba 0%, #7a8a99 25%, #5a6879 50%, #3a4658 75%, #2a3547 87.5%, #1a2437 100%)",
        }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector, next/image adds no value for local SVG */}
      <img
        src="/icons/contact-bg-lines.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[160%] w-[160%] max-w-none -translate-x-[70%] -translate-y-1/2 opacity-50"
      />
      <GrainOverlay className="opacity-[0.12] mix-blend-overlay" />

      <div className="relative h-[420px] w-full sm:h-[520px] lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[43%]">
        <Image
          src="/images/contact-portrait.png"
          alt="Nataliia Sychenko Romanova, founder of NSR Mallorca"
          fill
          sizes="(min-width: 1024px) 43vw, 100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-[2%] to-transparent to-[30%] lg:hidden" />
      </div>

      <Container className="relative py-16 lg:py-28">
        <Reveal className="flex flex-col gap-16 lg:ml-[45%] lg:gap-24">
          <ul className="flex flex-col items-end gap-2 self-end text-right font-serif text-sm uppercase tracking-wide text-alabaster">
            {labels.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-4 lg:max-w-[677px]">
            <h2 className="font-serif text-4xl leading-[1.1] sm:text-5xl lg:text-[48px]">
              {heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className="flex flex-col items-start gap-8">
              <p className="max-w-[419px] font-sans text-base leading-[1.4] text-paper">{body}</p>
              <Button href={cta.href} variant="light" target="_blank" rel="noopener noreferrer">
                {cta.label}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-8 border-t border-alabaster/20 pt-8 sm:flex-row sm:items-start sm:justify-between lg:max-w-[677px]">
            {contacts.map((contact) => (
              <div key={contact.label} className="flex flex-col items-start gap-2">
                <p className="font-sans text-[13px] uppercase text-alabaster/70">{contact.label}</p>
                <a
                  href={contact.href}
                  className="font-sans text-[15px] font-semibold underline decoration-from-font underline-offset-2"
                  {...(contact.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {contact.value}
                </a>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
