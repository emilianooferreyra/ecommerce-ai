import Image from "next/image";

interface GalleryImage {
  url: string;
  alt: string;
}

interface GallerySectionProps {
  title: string;
  subtitle?: string;
  images: GalleryImage[];
}

export function GallerySection({ title, subtitle, images }: GallerySectionProps) {
  // Show only 3 images
  const galleryImages = images.slice(0, 3);

  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Section Header - Left aligned like Top Sellers */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-4 text-base font-normal text-zinc-600 dark:text-zinc-400 sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {/* Gallery Grid - 3 columns with 15px gap */}
        <div className="grid grid-cols-1 gap-[15px] sm:grid-cols-3">
          {galleryImages.map((image) => (
            <div
              key={image.url}
              className="group relative aspect-square overflow-hidden bg-zinc-200 dark:bg-zinc-800"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
