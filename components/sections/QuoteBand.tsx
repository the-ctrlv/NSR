import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { quoteBand } from "@/lib/content";

export function QuoteBand() {
  return (
    <section className="bg-ink py-24 text-alabaster lg:py-32" aria-labelledby="quote-heading">
      <Container>
        <Reveal className="mx-auto flex max-w-[820px] flex-col items-center gap-10 text-center">
          <p className="flex items-center gap-3 font-sans text-eyebrow font-medium uppercase tracking-wide text-alabaster/70">
            <span aria-hidden="true">→</span>
            {quoteBand.eyebrow}
          </p>
          <p id="quote-heading" className="font-serif text-3xl leading-[1.3] sm:text-4xl lg:text-[42px]">
            “{quoteBand.quote}”
          </p>
          <p className="max-w-[560px] font-sans text-base leading-[1.5] text-alabaster/80">{quoteBand.body}</p>
          <Button href={quoteBand.cta.href} variant="light">
            {quoteBand.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
