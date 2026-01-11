import Image from "next/image";
import Link from "next/link";

interface CardData {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  ctaText: string;
}

interface DualCardSectionProps {
  cards: [CardData, CardData];
}

export function DualCardSection({ cards }: DualCardSectionProps) {
  return (
    <section className="bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-[15px] lg:grid-cols-2">
          {cards.map((card) => (
            <DualCard key={card.link} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface DualCardProps {
  card: CardData;
}

function DualCard({ card }: DualCardProps) {
  return (
    <Link href={card.link} className="group relative block overflow-hidden">
      {/* Background Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={card.imageUrl}
          alt={card.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={false}
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content - Positioned at top left */}
      <div className="absolute left-0 right-0 top-0 p-6 sm:p-8 lg:p-12">
        <h3 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
          {card.title}
        </h3>
        <p className="mt-2 max-w-md text-sm font-normal leading-relaxed text-white sm:text-base">
          {card.description}
        </p>

        {/* CTA Button */}
        <div className="mt-6">
          <span className="inline-flex h-12 items-center rounded-full bg-white px-8 text-sm font-bold uppercase tracking-wide text-zinc-900 shadow-lg transition-all group-hover:scale-105 group-hover:bg-zinc-100">
            {card.ctaText}
          </span>
        </div>
      </div>
    </Link>
  );
}
