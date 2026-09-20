import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Container } from "@/components/ui/Container";

// Next.js's `not-found.tsx` convention — with `output: "export"` this
// builds to a static 404.html that the host serves (with a real 404
// status) for any unmatched path, per the approved SEO brief's
// requirement for a correct custom 404 page.
export default function NotFound() {
  return (
    <>
      <PageHeader />
      <main className="bg-paper">
        <Container
          as="section"
          className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center"
        >
          <p className="font-sans text-eyebrow font-medium uppercase tracking-wide text-ink">
            404
          </p>
          <h1 className="font-serif text-4xl uppercase leading-[1.2] text-ink sm:text-h2">
            Page not found
          </h1>
          <p className="max-w-[480px] font-sans text-base leading-[1.4] text-ink/70">
            The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
          </p>
          <Link
            href="/"
            className="border border-ink bg-ink px-8 py-4 font-serif text-base uppercase tracking-[0.04em] text-alabaster transition-colors duration-300 hover:bg-ink-dim"
          >
            Back to homepage
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
