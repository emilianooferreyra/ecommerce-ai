import Link from "next/link";
import Image from "next/image";
import type { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";

interface CategoryShowcaseProps {
  categories: ALL_CATEGORIES_QUERYResult;
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  // Limit to 6 categories for the showcase
  const showcaseCategories = categories.slice(0, 6);

  if (showcaseCategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
            Shop by Category
          </h2>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {showcaseCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryCardProps {
  category: ALL_CATEGORIES_QUERYResult[number];
}

function CategoryCard({ category }: CategoryCardProps) {
  const imageUrl = category.image?.asset?.url;

  // Fallback placeholder image
  const placeholderImage = `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80`;

  return (
    <Link
      href={`/products?category=${category.slug}`}
      className="group block"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={imageUrl || placeholderImage}
          alt={category.title ?? "Category"}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="mt-3 text-center">
        <h3 className="text-base font-normal text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400 sm:text-lg">
          {category.title}
        </h3>
      </div>
    </Link>
  );
}
