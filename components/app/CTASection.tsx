"use client";

import { Button } from "@/components/ui/button";
import { useChatActions } from "@/lib/store/chat-store-provider";

export function CTASection() {
  const { openChat } = useChatActions();

  return (
    <section className="bg-zinc-900 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Content */}
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Get a free design consultation
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-zinc-300 sm:text-lg">
            Our AI-powered assistant helps you discover the perfect furniture for your space. Get personalized recommendations tailored to your style and needs.
          </p>

          {/* CTA Button */}
          <div className="mt-10">
            <Button
              size="lg"
              onClick={openChat}
              className="h-16 rounded-full bg-white px-16 text-lg font-semibold uppercase text-zinc-900 shadow-xl transition-all hover:scale-105 hover:bg-zinc-100 hover:shadow-2xl"
            >
              Start Your Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
