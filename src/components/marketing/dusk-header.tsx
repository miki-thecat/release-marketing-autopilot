"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

type NavItem = { readonly label: string; readonly href: string };

export function DuskHeader({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateOverflow = () => document.documentElement.classList.toggle("overflow-hidden", mediaQuery.matches);
    updateOverflow();
    mediaQuery.addEventListener("change", updateOverflow);
    return () => {
      mediaQuery.removeEventListener("change", updateOverflow);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open]);

  return (
    <header>
      <nav data-state={open ? "active" : undefined} className="bg-background fixed top-0 z-20 w-full border-b border-border max-lg:data-[state=active]:bottom-0">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative flex flex-wrap items-center justify-between max-lg:gap-6">
            <div className="max-lg:in-data-[state=active]:border-b flex w-full items-center justify-between gap-12 py-4 lg:w-auto lg:py-5">
              <Link href="/" aria-label="ReleaseFlow home" className="flex items-center gap-2 font-medium tracking-tight">
                <span className="grid size-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">R</span>
                <span>ReleaseFlow</span>
              </Link>
              <div className="max-lg:hidden">
                <ul className="flex gap-8 text-sm">
                  {items.map((item) => <li key={item.href}><a href={item.href} className="text-muted-foreground hover:text-foreground block transition-colors duration-150">{item.label}</a></li>)}
                </ul>
              </div>
              <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close navigation" : "Open navigation"} className="relative z-20 grid size-9 place-items-center lg:hidden">
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
            <div className="in-data-[state=active]:block mb-6 hidden w-full max-lg:space-y-8 lg:hidden">
              <ul>
                {items.map((item) => <li key={item.href}><a href={item.href} onClick={() => setOpen(false)} className="text-foreground block py-3 text-2xl font-medium">{item.label}</a></li>)}
              </ul>
              <Link href="/create" onClick={() => setOpen(false)} className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">Create a Release Pack</Link>
            </div>
            <Link href="/create" className="max-lg:hidden inline-flex h-8 items-center rounded-full bg-primary px-3 text-[0.8rem] font-medium text-primary-foreground">Create</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
