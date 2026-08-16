import Link from "next/link";
import { ArrowRight, FileVideo, PackageCheck } from "lucide-react";

type ProductEntryContent = {
  readonly inputLabel: string;
  readonly inputValue: string;
  readonly outputLabel: string;
  readonly outputValue: string;
  readonly action: string;
  readonly footnote: string;
};

export function ProductEntryAdapter({ content }: { content: ProductEntryContent }) {
  return (
    <div className="bg-background ring-foreground/6.5 relative rounded-2xl p-2 shadow-2xl shadow-black/55 ring">
      <div className="bg-foreground/2 rounded-xl border border-border p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-border pb-4 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">ReleaseFlow / Create</span><span>Local Core</span>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-xl border border-border bg-card p-4"><span className="text-xs text-muted-foreground">{content.inputLabel}</span><strong className="mt-3 flex items-center gap-2 text-sm"><FileVideo className="size-4" />{content.inputValue}</strong></div>
          <ArrowRight className="mx-auto size-4 text-muted-foreground max-sm:rotate-90" aria-hidden="true" />
          <div className="rounded-xl border border-border bg-card p-4"><span className="text-xs text-muted-foreground">{content.outputLabel}</span><strong className="mt-3 flex items-center gap-2 text-sm"><PackageCheck className="size-4" />{content.outputValue}</strong></div>
        </div>
        <Link href="/create" className="mt-5 flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-transform duration-200 hover:scale-[1.01]">
          <span>{content.action}<small className="mt-0.5 block text-xs opacity-65">{content.footnote}</small></span><ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
