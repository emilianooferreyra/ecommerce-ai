"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";

type FeaturedProduct = FEATURED_PRODUCTS_QUERYResult[number];

interface FeaturedCarouselProps {
  products: FEATURED_PRODUCTS_QUERYResult;
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full bg-zinc-50 dark:bg-zinc-950">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {products.map((product) => (
            <CarouselItem key={product._id} className="pl-0">
              <FeaturedSlide product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - positioned inside */}
        <CarouselPrevious className="left-4 h-12 w-12 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:left-8" />
        <CarouselNext className="right-4 h-12 w-12 border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white sm:right-8" />
      </Carousel>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 sm:bottom-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === index
                  ? "w-8 bg-white"
                  : "bg-white/50 hover:bg-white/70"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FeaturedSlideProps {
  product: FeaturedProduct;
}

function FeaturedSlide({ product }: FeaturedSlideProps) {
  const mainImage = product.images?.[0]?.asset?.url;

  return (
    <div className="relative flex min-h-[400px] items-center justify-center sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
      {/* Full Background Image */}
      <div className="absolute inset-0">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name ?? "Featured product"}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
            <span className="text-zinc-400">No image</span>
          </div>
        )}

        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-zinc-900/20" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          {product.name}
        </h2>

        {product.description && (
          <p className="mx-auto mt-3 max-w-2xl text-sm font-normal leading-relaxed text-white/90 sm:mt-4 sm:text-base md:text-lg">
            {product.description}
          </p>
        )}

        <div className="mt-6 sm:mt-8">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-full bg-white px-8 text-sm font-semibold uppercase text-zinc-900 shadow-xl transition-all hover:scale-105 hover:bg-zinc-100 hover:shadow-2xl sm:h-14 sm:px-12 sm:text-base"
          >
            <Link href={`/products/${product.slug}`}>Shop {product.name}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
