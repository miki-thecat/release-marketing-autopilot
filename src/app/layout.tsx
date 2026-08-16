import type { Metadata } from "next";
import { DEFAULT_LOCALE } from "@/locales";
import "./globals.css";

export const metadata: Metadata = {
  title: "ReleaseFlow · From shipped feature to finished release",
  description:
    "Turn a rough browser recording and product context into a polished release video and launch-ready social copy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={DEFAULT_LOCALE} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
