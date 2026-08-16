import Link from "next/link";
import styles from "./marketing.module.css";

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
    <div className={styles.productEntry}>
      <div className={styles.entryTopline}>
        <span><i /> RELEASEFLOW / CREATE</span>
        <span>LOCAL CORE · READY</span>
      </div>
      <div className={styles.entryFlow}>
        <div>
          <span>{content.inputLabel}</span>
          <strong><VideoIcon />{content.inputValue}</strong>
        </div>
        <div className={styles.entryConnector} aria-hidden="true"><span /><ArrowIcon /></div>
        <div>
          <span>{content.outputLabel}</span>
          <strong><PackIcon />{content.outputValue}</strong>
        </div>
      </div>
      <Link href="/create" className={styles.entryAction}>
        <span>{content.action}<small>{content.footnote}</small></span>
        <i><ArrowIcon /></i>
      </Link>
    </div>
  );
}

function VideoIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="m17 10 4-2v8l-4-2" /></svg>;
}

function PackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10" /></svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}
