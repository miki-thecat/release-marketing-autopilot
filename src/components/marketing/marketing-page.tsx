import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Clapperboard, Play, Sparkles } from "lucide-react";
import { marketingContent } from "@/content/marketing";
import { DuskHeader } from "./dusk-header";
import { ProductEntryAdapter } from "./product-entry-adapter";

const content = marketingContent;

export function MarketingPage() {
  return (
    <main lang="en" className="min-h-screen overflow-hidden bg-background text-foreground">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">Skip to content</a>
      <DuskHeader items={content.nav} />
      <div id="main-content">
        <Hero />
        <OutputProof />
        <BeforeAfter />
        <HowItWorks />
        <ProductWalkthrough />
        <UseCases />
        <Faqs />
        <FinalCta />
      </div>
      <Footer />
    </main>
  );
}

function Hero() {
  return (
    <section className="pt-36 md:pt-44">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex justify-between gap-10 max-md:flex-col md:items-end lg:mt-16">
          <div className="max-w-2xl">
            <p className="text-muted-foreground text-sm">{content.hero.eyebrow}</p>
            <h1 className="mt-5 text-balance text-5xl font-medium tracking-tight md:text-6xl">{content.hero.title}</h1>
            <p className="text-muted-foreground mt-5 max-w-xl text-balance text-lg">{content.hero.description}</p>
          </div>
          <Link href="/create" className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm shadow-black/10 transition-transform duration-200 hover:scale-[1.02]">Create a Release Pack <ArrowRight className="size-4" /></Link>
        </div>
        <div className="relative mt-8 rounded-3xl bg-black p-2 sm:mt-12">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/55 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.10),transparent_35%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
              <div><p className="text-sm text-muted-foreground">{content.hero.note}</p><h2 className="mt-4 max-w-md text-balance text-3xl font-medium tracking-tight">From browser recording to release-ready output.</h2></div>
              <ProductEntryAdapter content={content.productEntry} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OutputProof() {
  return (
    <section id="examples" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-muted-foreground max-w-4xl text-balance text-4xl font-medium tracking-tight"><span className="text-foreground">{content.proof.title}</span><br />{content.proof.description}</h2>
        <div className="mt-8 grid gap-4 md:mt-16 md:grid-cols-3">
          {content.demos.map((demo) => <OutputExample key={demo.id} demo={demo} />)}
        </div>
      </div>
    </section>
  );
}

function OutputExample({ demo }: { demo: (typeof content.demos)[number] }) {
  return (
    <article className="group rounded-3xl border border-border bg-card p-3">
      <div className="relative aspect-[9/11] overflow-hidden rounded-2xl border border-border bg-[linear-gradient(145deg,rgba(255,255,255,.09),transparent_42%)] p-4">
        <span className="rounded-full border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground">Internal demo</span>
        <div className="absolute inset-x-4 top-16 rounded-xl border border-border bg-background/90 p-3 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground"><span>RELEASE VIDEO</span><span>{demo.duration}</span></div>
          <div className="mt-3 flex aspect-video items-center justify-center rounded-lg bg-foreground text-background"><Play className="size-5 fill-current" /></div>
          <p className="mt-3 text-sm font-medium leading-snug">{demo.hook}</p>
        </div>
        <div className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-background p-3 shadow-xl shadow-black/20"><div className="flex items-center gap-2 text-[10px] text-muted-foreground"><span className="size-2 rounded-full bg-foreground" />LAUNCH COPY</div><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{demo.post}</p><div className="mt-3 flex gap-2"><span className="h-1.5 w-10 rounded-full bg-foreground/45" /><span className="h-1.5 w-7 rounded-full bg-foreground/20" /></div></div>
      </div>
      <div className="p-3"><p className="text-sm font-medium">{demo.label}</p><h3 className="mt-2 text-balance text-lg font-medium tracking-tight">{demo.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{demo.description}</p><div className="mt-4 flex gap-2 text-[11px] text-muted-foreground"><span>Release video</span><span>·</span><span>X</span><span>·</span><span>LinkedIn</span></div></div>
    </article>
  );
}

function BeforeAfter() {
  const sides = [content.transformation.before, content.transformation.after] as const;
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12"><div><p className="text-sm text-muted-foreground">{content.transformation.eyebrow}</p><h2 className="mt-4 max-w-md text-balance text-4xl font-medium tracking-tight lg:text-5xl">{content.transformation.title}</h2></div><p className="text-muted-foreground self-end text-balance text-lg">{content.transformation.description}</p></div>
        <div className="mt-8 grid gap-3 md:mt-16 md:grid-cols-2">
          {sides.map((side, index) => <article key={side.label} className="rounded-3xl border border-border bg-card p-6 sm:p-8"><div className="flex items-center justify-between text-xs text-muted-foreground"><span>{side.label}</span><span>{index === 0 ? "Input" : "Output"}</span></div><h3 className="mt-10 text-balance text-2xl font-medium tracking-tight">{side.title}</h3><ul className="mt-8 divide-y divide-border text-sm">{side.items.map((item) => <li key={item} className="flex items-center gap-3 py-3"><span className={index === 0 ? "text-muted-foreground" : "text-foreground"}>{index === 0 ? "—" : <Check className="size-4" />}</span>{item}</li>)}</ul></article>)}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-20"><div className="mx-auto max-w-7xl px-6"><p className="text-sm text-muted-foreground">{content.process.eyebrow}</p><h2 className="mt-4 max-w-3xl text-balance text-4xl font-medium tracking-tight lg:text-5xl">{content.process.title}</h2><div className="mt-8 grid gap-3 md:mt-16 md:grid-cols-3">{content.process.steps.map((step) => <article key={step.number} className="rounded-3xl border border-border bg-card p-6"><span className="text-sm text-muted-foreground">{step.number}</span><div className="mt-12 flex size-10 items-center justify-center rounded-full border border-border bg-foreground/5"><Sparkles className="size-4" /></div><h3 className="mt-6 text-xl font-medium tracking-tight">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p></article>)}</div></div></section>
  );
}

function ProductWalkthrough() {
  const stages = [
    ["Create", "Give the release a name, context, and browser recording.", <CreateSurface key="create" />],
    ["Plan", "The current pipeline validates media, analyzes it, and plans the story.", <PlanSurface key="plan" />],
    ["Processing", "See the job progress through the release workflow.", <ProcessingSurface key="processing" />],
    ["Render", "Render the 1080p release video from selected source moments.", <RenderSurface key="render" />],
    ["Release Pack", "Preview the video and copy the English X and LinkedIn posts.", <ReleasePackSurface key="pack" />],
  ] as const;
  return (
    <section className="py-16 md:py-20"><div className="mx-auto max-w-7xl px-6"><h2 className="text-muted-foreground max-w-4xl text-balance text-4xl font-medium tracking-tight"><span className="text-foreground">Built for the full release workflow.</span><br />The product proof follows the real route, not a generic campaign.</h2><div className="mt-16 grid gap-6 md:mt-32 lg:grid-cols-[auto_1fr]"><aside className="sticky top-24 h-fit w-48 max-lg:hidden"><p className="text-sm text-muted-foreground">Product</p><ol className="mt-4 space-y-1">{stages.map(([label]) => <li key={label}><a href={`#stage-${label.toLowerCase().replace(" ", "-")}`} className="block rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground">{label}</a></li>)}</ol></aside><div className="flex flex-col gap-16 md:gap-32">{stages.map(([label, description, surface]) => <article id={`stage-${label.toLowerCase().replace(" ", "-")}`} key={label} className="grid scroll-mt-32 gap-6 sm:grid-cols-2 md:grid-cols-5 lg:gap-12"><div className="flex flex-col justify-between pb-4 md:col-span-2"><div><h3 className="mb-6 text-sm font-medium text-muted-foreground">{label}</h3><p className="text-balance text-lg font-medium">{description}</p></div><p className="mt-8 text-sm text-muted-foreground">Current ReleaseFlow interface · representative state</p></div><div className="relative flex aspect-square items-center justify-center rounded-3xl border border-border bg-foreground/[.02] p-3 md:col-span-3">{surface}</div></article>)}</div></div></div></section>
  );
}

function Surface({ children }: { children: React.ReactNode }) { return <div className="h-full w-full overflow-hidden rounded-2xl border border-border bg-background p-3 text-xs shadow-xl shadow-black/15">{children}</div>; }
function CreateSurface() { return <Surface><p className="border-b border-border pb-3 font-medium">Create a Release Pack</p><div className="mt-4 space-y-3"><Field label="Browser recording" value="feature-walkthrough.mp4" icon={<Clapperboard className="size-3.5" />} /><Field label="Feature name" value="Workspace search" /><Field label="Description" value="Find the right project in fewer steps." /><button type="button" className="w-full rounded-lg bg-primary py-2 text-primary-foreground">Generate Release Pack</button></div></Surface>; }
function PlanSurface() { return <Surface><p className="border-b border-border pb-3 font-medium">Storyboard plan</p><div className="mt-4 space-y-2">{["Opening hook", "Product moment", "Outcome", "Call to action"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-lg border border-border p-2.5"><span className="grid size-5 place-items-center rounded-full bg-foreground text-[9px] text-background">{index + 1}</span><span>{item}</span></div>)}</div></Surface>; }
function ProcessingSurface() { return <Surface><p className="border-b border-border pb-3 font-medium">Preparing release</p><div className="mt-8 grid place-items-center"><div className="grid size-20 place-items-center rounded-full border-4 border-foreground/20 border-t-foreground text-sm font-medium">68%</div><div className="mt-7 w-full space-y-2">{["Upload complete", "Media analyzed", "Storyboard planned", "Rendering"].map((item, index) => <div className="flex items-center justify-between text-muted-foreground" key={item}><span>{item}</span>{index < 3 ? <Check className="size-3.5 text-foreground" /> : <span>…</span>}</div>)}</div></div></Surface>; }
function RenderSurface() { return <Surface><p className="border-b border-border pb-3 font-medium">Release video</p><div className="mt-4 flex aspect-video items-center justify-center rounded-lg bg-foreground text-background"><Play className="size-6 fill-current" /></div><div className="mt-4 flex items-center gap-2"><span>00:12</span><span className="h-1 flex-1 rounded-full bg-foreground/15"><i className="block h-full w-2/3 rounded-full bg-foreground" /></span><span>00:24</span></div><p className="mt-4 text-muted-foreground">1080p H.264 · captions and focused pacing</p></Surface>; }
function ReleasePackSurface() { return <Surface><p className="border-b border-border pb-3 font-medium">Release Pack</p><div className="mt-4 grid gap-3"><div className="rounded-lg border border-border p-3"><span className="text-muted-foreground">Video</span><p className="mt-1 font-medium">release-video.mp4</p></div><div className="rounded-lg border border-border p-3"><span className="text-muted-foreground">English X post</span><p className="mt-1 leading-relaxed">The new search is ready to use. See the product moment in action.</p></div><div className="rounded-lg border border-border p-3"><span className="text-muted-foreground">English LinkedIn post</span><p className="mt-1 leading-relaxed">A clearer way to find the work that matters.</p></div></div></Surface>; }
function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) { return <div><span className="text-muted-foreground">{label}</span><div className="mt-1 flex min-h-8 items-center gap-2 rounded-lg border border-border px-2.5">{icon}{value}</div></div>; }

function UseCases() { return <section id="use-cases" className="py-16 md:py-20"><div className="mx-auto max-w-7xl px-6"><div className="grid gap-6 md:grid-cols-2 md:gap-12"><div><p className="text-sm text-muted-foreground">{content.useCases.eyebrow}</p><h2 className="mt-4 max-w-md text-balance text-4xl font-medium tracking-tight lg:text-5xl">{content.useCases.title}</h2></div><p className="text-muted-foreground self-end text-balance text-lg">{content.useCases.description}</p></div><div className="mt-8 grid gap-3 md:mt-16 md:grid-cols-3">{content.useCases.items.map((item) => <article key={item.kicker} className="group rounded-3xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">{item.kicker}</p><h3 className="mt-12 text-balance text-xl font-medium tracking-tight">{item.title}</h3><ArrowRight className="mt-8 size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1" /></article>)}</div></div></section>; }

function Faqs() { return <section id="faq" className="py-16 md:py-24"><div className="mx-auto max-w-7xl px-6"><div className="grid gap-12 md:grid-cols-2 md:gap-6"><div><p className="text-sm text-muted-foreground">{content.faq.eyebrow}</p><h2 className="mt-4 max-w-sm text-balance text-4xl font-medium tracking-tight">{content.faq.title}</h2></div><div>{content.faq.items.map((item, index) => <details key={item.question} name="releaseflow-faq" open={index === 0} className="group border-b border-dashed border-border"><summary className="flex cursor-pointer list-none items-center gap-4 py-4 text-base font-medium"><span>{item.question}</span><ChevronDown className="ml-auto size-4 text-muted-foreground transition-transform group-open:rotate-180" /></summary><p className="max-w-xl pb-4 leading-relaxed text-muted-foreground">{item.answer}</p></details>)}</div></div></div></section>; }

function FinalCta() { return <section className="py-16 md:py-20"><div className="mx-auto max-w-7xl px-6"><div className="flex items-center justify-center gap-6 max-lg:flex-col max-lg:text-center lg:items-end lg:justify-between"><div><p className="text-sm text-muted-foreground">{content.finalCta.eyebrow}</p><h2 className="mt-4 max-w-4xl text-balance text-5xl font-semibold tracking-tight xl:text-6xl">{content.finalCta.title}</h2></div><Link href="/create" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground">{content.finalCta.action}<ArrowRight className="size-4" /></Link></div></div></section>; }

function Footer() { return <footer><div className="mx-auto max-w-7xl space-y-16 px-6 pb-6 pt-24"><div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:grid-cols-4 lg:grid-cols-6"><div className="col-span-full lg:col-span-3"><Link href="/" aria-label="ReleaseFlow home" className="flex items-center gap-2 font-medium tracking-tight"><span className="grid size-8 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">R</span>ReleaseFlow</Link><p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">A focused local workflow for turning browser recordings into release videos and English social copy.</p></div><div><span className="text-sm">Explore</span><ul className="mt-4 space-y-4 text-sm text-muted-foreground">{content.nav.map((item) => <li key={item.href}><a href={item.href} className="transition-colors hover:text-foreground">{item.label}</a></li>)}</ul></div><div><span className="text-sm">Product</span><ul className="mt-4 space-y-4 text-sm text-muted-foreground"><li><Link href="/create" className="transition-colors hover:text-foreground">Create a Release Pack</Link></li></ul></div></div><div className="grid gap-6 border-t border-border pt-6 sm:grid-cols-2"><span className="text-sm text-muted-foreground">Local Core MVP · deterministic mode available</span><span className="text-sm text-muted-foreground sm:text-right">© {new Date().getFullYear()} ReleaseFlow</span></div></div></footer>; }
