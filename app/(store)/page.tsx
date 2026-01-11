import { Suspense } from "react";

import { FeaturedCarousel } from "@/components/app/FeaturedCarousel";
import { sanityFetch } from "@/sanity/lib/live";
import { ALL_CATEGORIES_QUERY } from "@/sanity/queries/categories";
import { FEATURED_PRODUCTS_QUERY } from "@/sanity/queries/products";
import { FeaturedCarouselSkeleton } from "@/components/app/FeaturedCarouselSkeleton";
import { CategoryShowcase } from "@/components/app/CategoryShowcase";
import { EditorialSection } from "@/components/app/EditorialSection";
import { DualCardSection } from "@/components/app/DualCardSection";
import { CTASection } from "@/components/app/CTASection";
import { TopSellersSection } from "@/components/app/TopSellersSection";
import { GallerySection } from "@/components/app/GallerySection";

export default async function Home() {
  // Fetch categories for showcase
  const { data: categories } = await sanityFetch({
    query: ALL_CATEGORIES_QUERY,
  });

  // Fetch featured products for carousel and top sellers
  const { data: featuredProducts } = await sanityFetch({
    query: FEATURED_PRODUCTS_QUERY,
  });

  return (
    <div className="">
      {/* 1. Hero Carousel */}
      <Suspense fallback={<FeaturedCarouselSkeleton />}>
        <FeaturedCarousel products={featuredProducts} />
      </Suspense>

      {/* 2. Shop by Category */}
      <CategoryShowcase categories={categories} />

      {/* 3. Editorial Section - Customize for Connection */}
      <EditorialSection
        title="Customize for connection"
        description="Create spaces that bring people together. Our furniture is designed to foster meaningful moments and lasting memories in your home."
        imageUrl="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80"
        ctaText="Explore Living Room"
        ctaLink="/products?category=sofas"
        imagePosition="left"
      />

      {/* 4. Dual Cards - Fun Function + Personality */}
      <DualCardSection
        cards={[
          {
            title: 'Put the "fun" in function',
            description: "Kick your feet up, grab a seat, or use it as a makeshift table — it all feels good!",
            imageUrl: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
            link: "/products?category=storage",
            ctaText: "Shop Ottomans & Poufs",
          },
          {
            title: "Shining personality",
            description: "Lamps are a subtle way to put your stamp on any room.",
            imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
            link: "/products?category=lighting",
            ctaText: "Shop Lighting",
          },
        ]}
      />

      {/* 5. Get a Free Design Plan */}
      <CTASection />

      {/* 6. Shop Top Sellers */}
      <TopSellersSection products={featuredProducts} />

      {/* 7. Great Style in the Wild */}
      <GallerySection
        title="Great style in the wild"
        subtitle="See how our customers style their spaces"
        images={[
          { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80", alt: "Customer space 1" },
          { url: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80", alt: "Customer space 2" },
          { url: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80", alt: "Customer space 3" },
        ]}
      />
    </div>
  );
}
