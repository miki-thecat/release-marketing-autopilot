// Adapted from Tailark OSS Dusk Hero Section 2, installed with shadcn CLI.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroHeader } from "@/components/hero-section-2-header";
import { ProductEntryAdapter } from "@/components/marketing/product-entry-adapter";
import { marketingContent } from "@/content/marketing";

export default function HeroSection() {
  const { hero, productEntry } = marketingContent;
  return <><HeroHeader /><section className="pt-36 md:pt-44"><div className="mx-auto max-w-7xl px-6"><div className="flex justify-between gap-6 max-md:flex-col md:items-end lg:mt-16"><div className="max-w-2xl"><p className="text-sm text-muted-foreground">{hero.eyebrow}</p><h1 className="mt-5 text-balance text-5xl font-medium tracking-tight md:text-6xl">{hero.title}</h1><p className="mt-5 max-w-xl text-balance text-lg text-muted-foreground">{hero.description}</p></div><Button className="w-fit" size="lg" nativeButton={false} render={<Link href="/create">Create a Release Pack</Link>} /></div><div className="relative -mx-2 mt-8 overflow-hidden rounded-3xl bg-black p-2 sm:mt-12"><div className="relative rounded-2xl bg-background p-5 shadow-2xl shadow-black/55 ring ring-foreground/10 sm:p-8"><div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center"><div><p className="text-sm text-muted-foreground">{hero.note}</p><p className="mt-4 max-w-md text-balance text-3xl font-medium tracking-tight">From browser recording to release-ready output.</p></div><ProductEntryAdapter content={productEntry} /></div></div></div></div></section></>;
}
