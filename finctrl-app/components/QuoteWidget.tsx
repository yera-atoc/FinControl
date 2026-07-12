"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { QUOTES, type Quote } from "@/lib/quotes";

export function QuoteWidget() {
  const [quote, setQuote] = useState<Quote | null>(null);

  useEffect(() => {
    // Picked client-side after mount so every visit shows a different quote
    // without causing a server/client render mismatch.
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (!quote) {
    // Reserve space to avoid layout shift while the quote is chosen.
    return <div className="rounded-2xl mb-4 h-[104px] bg-card animate-fade-in" />;
  }

  return (
    <div
      className="rounded-2xl p-5 mb-4 relative overflow-hidden animate-fade-in"
      style={{ background: "linear-gradient(135deg, #0A84FF 0%, #5E5CE6 100%)" }}
    >
      <Sparkles size={16} className="absolute top-4 right-4 text-white/40" />
      <div className="text-[11px] font-medium uppercase tracking-wide mb-2 text-white/70">
        цитата дня
      </div>
      <p className="text-[15px] font-medium leading-snug mb-2 text-white">«{quote.text}»</p>
      <p className="text-[12px] text-white/70">— {quote.author}</p>
    </div>
  );
}
