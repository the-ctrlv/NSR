"use client";

import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { closingCta } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";

const { labels, heading, body, cta, contacts } = closingCta;

// Supporting conversion events per the approved SEO brief (no form on
// this site yet, so no form_submit — wire that up the same way once one
// exists). No-ops until analytics has actually loaded (i.e. consent was
// accepted), and never carries message content or field values.
const CONTACT_EVENT: Record<string, string> = {
  WhatsApp: "whatsapp_click",
  Email: "email_click",
  LinkedIn: "linkedin_click",
};

function ContactItem({ contact }: { contact: (typeof contacts)[number] }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center lg:items-start lg:text-left">
      <p className="font-sans text-[13px] uppercase text-alabaster/70">
        {contact.label}
      </p>
      <a
        href={contact.href}
        onClick={() => {
          const event = CONTACT_EVENT[contact.label];
          if (event) trackEvent(event);
        }}
        className="font-sans text-[15px] font-semibold whitespace-nowrap underline decoration-from-font underline-offset-2"
        {...(contact.href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {contact.value}
      </a>
    </div>
  );
}

export function ClosingCta() {
  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-ink text-alabaster"
    >
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          opacity: 0.62,
          background:
            "radial-gradient(ellipse 60vw 40vh at 20% 10%, #9aacba 0%, #5a6879 50%, #3a4658 75%, #2a3547 87.5%, #141c2c 100%)",
        }}
      />
      {/* Mobile/tablet: per the Figma mobile frame, a much tighter glow
          centered near the top — the previous 141vw/120vh ellipse was so
          large relative to a phone viewport that most of the screen never
          reached the darker stops, reading as uniformly light instead of
          fading to ink toward the edges. */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          opacity: 0.62,
          background:
            "radial-gradient(ellipse 108vw 70vh at 50% 16%, #9aacba 0%, #5a6879 30%, #3a4658 50%, #2a3547 68%, #141c2c 85%)",
        }}
      />
      {/* Same two-layer idea as Hero's bg-line/bg-line-2, same two assets,
          just spun via plain CSS here instead of GSAP. */}
      <div className="absolute left-[10%] top-[50%] h-full w-full max-w-none -translate-x-[40%] -translate-y-1/2">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector, next/image adds no value for local SVG */}
        <img
          src="/icons/bg-line.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-30 rotate-45 motion-reduce:animate-none animate-[spin_90s_linear_infinite]"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative vector, next/image adds no value for local SVG */}
        <img
          src="/icons/bg-line-2.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-30 motion-reduce:animate-none animate-[spin-reverse_130s_linear_infinite]"
        />
      </div>
      <GrainOverlay className="opacity-[0.22] mix-blend-overlay" />

      {/* Portrait — desktop only: absolute left column. Mobile/tablet gets its own
          full-bleed treatment further down, with the contacts overlaid on it. */}
      <div className="absolute inset-y-0 left-0 hidden w-[43%] lg:block">
        <Image
          src="/images/contact-portrait.png"
          alt="Nataliia Sychenko Romanova, founder of NSR Mallorca"
          fill
          sizes="43vw"
          className="object-cover object-top"
        />
      </div>

      <Container className="px-4 sm:px-8 relative pt-20 pb-10 lg:pb-10">
        <Reveal className="flex flex-col items-center gap-10 text-center lg:ml-[49%] lg:items-start lg:gap-16 lg:text-left">
          <ul className="flex flex-row flex-wrap items-center justify-center gap-2 font-serif text-sm uppercase tracking-wide text-alabaster lg:flex-col lg:items-end lg:justify-normal lg:gap-2 lg:self-end lg:text-right">
            {labels.map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="lg:hidden">
                    |
                  </span>
                )}
                {label}
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-4 lg:items-start lg:max-w-[677px]">
            <h2 className="font-serif text-[28px] leading-[1.15] sm:text-[34px] lg:text-[48px] lg:leading-[1.1]">
              {heading.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className="flex flex-col items-center gap-6 lg:items-start lg:gap-8">
              <p className="max-w-[370px] font-sans text-base leading-[1.4] text-paper sm:max-w-[380px] lg:max-w-[419px]">
                {body}
              </p>
              <Button
                href={cta.href}
                variant="light"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click")}
                className="w-full max-w-[280px] lg:max-w-[300px]"
              >
                {cta.label}
              </Button>
            </div>
          </div>

          {/* Contacts — desktop only, bordered row. Mobile/tablet version renders
              below, overlaid on the portrait image. */}
          <div className="hidden w-full border-t border-alabaster/20 pt-8 lg:flex lg:max-w-[677px] lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            {contacts.map((contact) => (
              <ContactItem key={contact.label} contact={contact} />
            ))}
          </div>
        </Reveal>
      </Container>
      <div className="w-full relative -mt-20 lg:hidden">
        <Image
          src="/images/contact-portrait-scaled.png"
          alt="Nataliia Sychenko Romanova, founder of NSR Mallorca"
          width={798}
          height={1200}
          sizes="100vw"
          className="block h-auto w-full lg:p-[20vw] xl:p-0 md:max-w-[400px] xl:max-w-auto mx-auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-[8%] via-ink/60 via-[42%] to-transparent to-[72%]" />
      </div>

      {/* Portrait + contacts — mobile/tablet only, full-bleed image with the
          contacts overlaid near the bottom, fading into the section background. */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 mt-4 lg:hidden">
        <div className="relative z-10 flex flex-col items-center gap-6 px-6 pb-14 text-center sm:-mt-32">
          {contacts.map((contact) => (
            <ContactItem key={contact.label} contact={contact} />
          ))}
        </div>
      </div>
    </section>
  );
}
