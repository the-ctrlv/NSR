import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BusinessIcon, PrivateIcon, PropertyIcon, Sparkle } from "@/components/icons/CategoryIcons";
import { serviceCategories } from "@/lib/content";

const iconFor = {
  private: PrivateIcon,
  property: PropertyIcon,
  business: BusinessIcon,
} as const;

export function ServiceCategories() {
  return (
    <section className="bg-paper py-24 lg:py-32" aria-labelledby="categories-heading">
      <Container>
        <div className="mb-16 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <Eyebrow>{serviceCategories.eyebrow}</Eyebrow>
          <h2
            id="categories-heading"
            className="max-w-[381px] font-serif text-2xl leading-[1.2] text-ink lg:text-right"
          >
            {serviceCategories.heading}
          </h2>
        </div>

        <Reveal
          as="ul"
          stagger={0.15}
          className="grid grid-cols-1 gap-px border-t border-hairline bg-hairline sm:grid-cols-3"
        >
          {serviceCategories.categories.map((category) => {
            const Icon = iconFor[category.icon as keyof typeof iconFor];
            return (
              <li key={category.title} className="flex flex-col items-center gap-8 bg-paper px-6 py-10 text-center">
                <Icon className="h-[100px] w-[100px] text-ink" />
                <div>
                  <h3 className="font-serif text-2xl leading-[1.2] text-ink">{category.title}</h3>
                  <p className="mt-4 font-sans text-[15px] leading-[1.4] text-ink/80">{category.body}</p>
                </div>
                <span className="h-8 w-px bg-hairline" aria-hidden="true" />
                <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-sans text-sm text-ink/80">
                  {category.tags.map((tag, i) => (
                    <li key={tag} className="flex items-center gap-3">
                      {tag}
                      {i < category.tags.length - 1 && <Sparkle className="h-2 w-2 text-ink/40" />}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}
