import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinCtrl",
  description: "Финансы под контролем",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="font-sans text-ink">{children}</body>
    </html>
  );
}
