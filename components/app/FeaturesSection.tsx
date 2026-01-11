"use client";

import { Truck, Shield, HeartHandshake, Sparkles } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Complimentary shipping on all orders with fast and reliable service.",
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Premium materials and expert craftsmanship in every piece.",
    },
    {
      icon: Sparkles,
      title: "AI Assistant",
      description: "Smart recommendations tailored to your style and preferences.",
    },
    {
      icon: HeartHandshake,
      title: "Expert Support",
      description: "Dedicated team ready to assist with your furniture needs.",
    },
  ];

  return (
    <section className="bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  feature: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  };
}

function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;

  return (
    <div className="group">
      {/* Icon */}
      <div className="mb-6 inline-flex h-10 w-10 items-center justify-center">
        <Icon className="h-10 w-10 text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-400" />
      </div>

      {/* Content */}
      <h3 className="mb-3 text-lg font-light text-zinc-900 dark:text-zinc-100">
        {feature.title}
      </h3>
      <p className="text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-400">
        {feature.description}
      </p>
    </div>
  );
}
