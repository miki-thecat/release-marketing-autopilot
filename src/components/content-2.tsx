// Adapted from Tailark OSS Dusk Content 2, installed with shadcn CLI.
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { marketingContent } from "@/content/marketing";

export default function Content() {
  const { transformation, process } = marketingContent;
  const sides = [transformation.before, transformation.after] as const;
  return <section id="how-it-works" className="py-16 md:py-20"><div className="mx-auto max-w-7xl px-6"><div className="grid gap-6 md:grid-cols-2 md:gap-12"><div><p className="text-sm text-muted-foreground">{transformation.eyebrow}</p><h2 className="mt-4 max-w-md text-balance text-4xl font-medium tracking-tight lg:text-5xl">{transformation.title}</h2></div><p className="self-end text-balance text-lg text-muted-foreground">{transformation.description}</p></div><div className="mt-8 grid gap-3 md:mt-16 md:grid-cols-2">{sides.map((side, index) => <Card key={side.label} className="p-6 sm:p-8"><div className="flex justify-between text-xs text-muted-foreground"><span>{side.label}</span><span>{index ? "Output" : "Input"}</span></div><h3 className="mt-10 text-2xl font-medium tracking-tight">{side.title}</h3><ul className="mt-8 divide-y divide-border text-sm">{side.items.map((item) => <li key={item} className="flex gap-3 py-3">{index ? <Check className="size-4" /> : "—"}{item}</li>)}</ul></Card>)}</div><p className="mt-20 text-sm text-muted-foreground">{process.eyebrow}</p><h2 className="mt-4 max-w-3xl text-4xl font-medium tracking-tight lg:text-5xl">{process.title}</h2><div className="mt-8 grid gap-3 md:mt-16 md:grid-cols-3">{process.steps.map((step) => <Card key={step.number} className="p-6"><span className="text-sm text-muted-foreground">{step.number}</span><h3 className="mt-12 text-xl font-medium">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p></Card>)}</div></div></section>;
}
