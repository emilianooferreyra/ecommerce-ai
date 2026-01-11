"use client";

import Image from "next/image";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";

export function FloatingAIButton() {
  const { openChat } = useChatActions();
  const isChatOpen = useIsChatOpen();

  if (isChatOpen) return null;

  return (
    <button
      onClick={openChat}
      className="group fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 hover:shadow-xl dark:bg-zinc-900 dark:shadow-zinc-800/50"
      aria-label="Ask AI"
    >
      <div className="relative h-10 w-10">
        <Image
          src="/eurodec-logo.png"
          alt="Ask AI"
          fill
          className="object-contain"
        />
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white shadow-lg group-hover:block dark:bg-zinc-100 dark:text-zinc-900">
        Ask AI
        <div className="absolute -bottom-1 right-4 h-2 w-2 rotate-45 bg-zinc-900 dark:bg-zinc-100" />
      </div>
    </button>
  );
}
