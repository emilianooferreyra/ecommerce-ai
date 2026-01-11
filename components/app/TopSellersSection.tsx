import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";

interface TopSellersSectionProps {
  products: FEATURED_PRODUCTS_QUERYResult;
}

export function TopSellersSection({ products }: TopSellersSectionProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Show up to 4 products
  const topProducts = products.slice(0, 4);

  return (
    <section className="bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
            Shop top sellers
          </h2>
          <Link
            href="/products"
            className="hidden text-base font-light text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 sm:block"
          >
            View all
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
          {topProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="text-base font-light text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: FEATURED_PRODUCTS_QUERYResult[number];
}

function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.asset?.url;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name ?? "Product"}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-zinc-400">No image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-sm font-normal text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400 sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1 text-sm font-light text-zinc-600 dark:text-zinc-400">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
