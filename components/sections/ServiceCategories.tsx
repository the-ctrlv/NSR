"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { serviceCategories } from "@/lib/content";

const stars = ["/icons/star-a.svg", "/icons/star-b.svg", "/icons/star-c.svg"];

function TagRow({ tags }: { tags: readonly string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // Which tag indices are the LAST tag on their own visual line — only
  // knowable by actually measuring the wrapped layout in the browser, not
  // from the data alone. Every tag already carries its own leading star
  // (below), so a wrapped line's start always has one; a wrapped line's
  // END only gets one if its last tag is in this set. Defaults to just the
  // final tag (correct for the common case: everything fits on one line,
  // including the very first paint before this effect runs).
  const [lineEnds, setLineEnds] = useState<Set<number>>(
    () => new Set([tags.length - 1]),
  );

  useLayoutEffect(() => {
    const measure = () => {
      const tops = tagRefs.current.map((el) => el?.offsetTop ?? 0);
      const ends = new Set<number>();
      tops.forEach((top, i) => {
        if (i === tops.length - 1 || top !== tops[i + 1]) ends.add(i);
      });
      setLineEnds(ends);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [tags]);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2"
    >
      {tags.map((tag, index) => (
        <span
          key={tag}
          ref={(el) => {
            tagRefs.current[index] = el;
          }}
          className="flex items-center gap-1"
        >
          <img
            src={stars[index % stars.length]}
            alt=""
            aria-hidden="true"
            className="size-[9px]"
          />
          <span className="font-sans text-[15px] font-semibold text-alabaster/80">
            {tag}
          </span>
          {lineEnds.has(index) && (
            <img
              src={stars[(index + 1) % stars.length]}
              alt=""
              aria-hidden="true"
              className="size-[9px]"
            />
          )}
        </span>
      ))}
    </div>
  );
}

function PropertyIcon() {
  return (
    <div className="relative size-[100px]" aria-hidden="true">
      <div className="absolute inset-0 border-[1.5px] border-ink-dim" />
      <div className="absolute inset-[25px] border-[1.5px] border-ink-dim" />
      <div className="absolute inset-[50px] border-[1.5px] border-ink-dim" />
      <div className="absolute inset-[75px] border-[1.5px] border-ink-dim" />
    </div>
  );
}

export function ServiceCategories() {
  return (
    <section
      data-hide-floating-cta-from
      className="relative isolate overflow-hidden bg-ink py-20 text-alabaster"
      aria-labelledby="categories-heading"
    >
      <GrainOverlay className="opacity-[0.22] mix-blend-overlay" />
      <Container className="relative h-full flex flex-col justify-between">
        <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <Eyebrow className="!text-alabaster">
            {serviceCategories.eyebrow}
          </Eyebrow>
          <h2
            id="categories-heading"
            className="max-w-[381px] font-sans text-base font-medium leading-[1.4] lg:text-right"
          >
            {serviceCategories.intro}
          </h2>
        </div>

        <Reveal
          as="ul"
          stagger={0.15}
          className="grid grid-cols-1 border-y border-ink-dim/60 sm:grid-cols-1 lg:grid-cols-3"
        >
          {serviceCategories.categories.map((category, index) => {
            const isLast = index === serviceCategories.categories.length - 1;
            return (
              <li
                key={category.title}
                className={`flex flex-col items-center justify-between gap-8 border-ink-dim/60 px-6 py-10 text-center sm:px-10 sm:py-14 lg:px-6 lg:py-10 ${
                  isLast ? "" : "border-b lg:border-b-0 lg:border-r"
                }`}
              >
                <div className="flex flex-col items-center gap-5">
                  {category.icon === "private" && (
                    <img
                      src="/icons/service-private.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-[100px]"
                    />
                  )}
                  {category.icon === "property" && <PropertyIcon />}
                  {category.icon === "business" && (
                    <img
                      src="/icons/service-business.svg"
                      alt=""
                      aria-hidden="true"
                      className="size-[100px]"
                    />
                  )}
                  <div>
                    <h3 className="font-serif text-2xl leading-[1.2]">
                      {category.title}
                    </h3>
                    <p className="mt-4 whitespace-pre-line font-sans text-[15px] leading-[1.4] text-alabaster/80">
                      {category.body}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <span
                    className="h-[50px] w-px bg-ink-dim"
                    aria-hidden="true"
                  />
                  {/* The card's outer height is already equal for all three
                      (CSS grid stretches every <li> to the tallest one),
                      and `justify-between` above puts 100% of the leftover
                      space between the top content and this divider+tags
                      group — so the divider's vertical position works out
                      to (card height − this group's own height), which
                      depends only on THIS block, never on how tall the top
                      content above happens to be. "Private Client Affairs"
                      has the most tags and wraps to the most lines at
                      narrower widths (e.g. iPad landscape, 1024px) — a
                      fixed min-height sized for that worst case, applied to
                      every card, keeps this block (and so the divider)
                      the same height everywhere regardless of how few tags
                      a given category actually has. */}
                  <div className="flex min-h-[75px] flex-col items-center gap-1 lg:min-h-[160px]">
                    {category.tagRows.map((row, index) => (
                      <TagRow key={index} tags={row} />
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
