import type { Metadata } from "next";
import { DEFAULT_LOCALE, locales } from "@/locales";
import "./globals.css";

const messages = locales[DEFAULT_LOCALE];

export const metadata: Metadata = {
  title: "ReleaseFlow",
  description: messages.hero.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body>{children}</body>
    </html>
  );
}
