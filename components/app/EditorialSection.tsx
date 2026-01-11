import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditorialSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
  imagePosition?: "left" | "right";
}

export function EditorialSection({
  title,
  description,
  imageUrl,
  ctaText,
  ctaLink,
  imagePosition = "left",
}: EditorialSectionProps) {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div
          className={`grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 ${
            imagePosition === "right" ? "lg:grid-flow-dense" : ""
          }`}
        >
          {/* Image */}
          <div
            className={`relative aspect-[4/3] overflow-hidden bg-zinc-200 dark:bg-zinc-800 ${
              imagePosition === "right" ? "lg:col-start-2" : ""
            }`}
          >
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div
            className={`flex flex-col justify-center ${
              imagePosition === "right" ? "lg:col-start-1" : ""
            }`}
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mt-6 text-base font-light leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
              {description}
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-14 rounded-full bg-zinc-900 px-12 text-base font-semibold uppercase text-white transition-all hover:scale-105 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                <Link href={ctaLink}>{ctaText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
