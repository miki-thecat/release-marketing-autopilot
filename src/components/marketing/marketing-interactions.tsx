"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { DemoExample } from "@/content/marketing";
import styles from "./marketing.module.css";

type NavItem = { readonly label: string; readonly href: string };

export function MobileNavigation({ items }: { items: readonly NavItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function close() {
    dialogRef.current?.close();
  }

  return (
    <div className={styles.mobileNavigation}>
      <button
        type="button"
        className={styles.menuButton}
        aria-label="Open navigation"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span />
        <span />
      </button>
      <dialog className={styles.mobileDialog} ref={dialogRef} onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}>
        <div className={styles.mobileDialogPanel}>
          <div className={styles.mobileDialogTop}>
            <span>Navigate</span>
            <button type="button" onClick={close} aria-label="Close navigation">Close</button>
          </div>
          <nav aria-label="Mobile navigation">
            {items.map((item, index) => (
              <a key={item.href} href={item.href} onClick={close}>
                <span>0{index + 1}</span>{item.label}
              </a>
            ))}
          </nav>
          <Link href="/create" className={styles.mobileDialogCta} onClick={close}>
            Create a Release Pack <ArrowIcon />
          </Link>
        </div>
      </dialog>
    </div>
  );
}

export function DemoGallery({ demos }: { demos: readonly DemoExample[] }) {
  const [activeId, setActiveId] = useState(demos[0]?.id);
  const activeDemo = demos.find((demo) => demo.id === activeId) ?? demos[0];
  if (!activeDemo) return null;

  function moveTab(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const keyOffsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1 };
    if (!(event.key in keyOffsets) && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? demos.length - 1
        : (index + keyOffsets[event.key] + demos.length) % demos.length;
    const nextDemo = demos[nextIndex];
    if (!nextDemo) return;
    setActiveId(nextDemo.id);
    window.requestAnimationFrame(() => document.getElementById(`demo-tab-${nextDemo.id}`)?.focus());
  }

  return (
    <div className={styles.galleryShell}>
      <div className={styles.galleryTabs} role="tablist" aria-label="Internal release demos">
        {demos.map((demo, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={demo.id === activeDemo.id}
            aria-controls={`demo-panel-${demo.id}`}
            id={`demo-tab-${demo.id}`}
            tabIndex={demo.id === activeDemo.id ? 0 : -1}
            key={demo.id}
            onClick={() => setActiveId(demo.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            <span>0{index + 1}</span>{demo.label}
          </button>
        ))}
      </div>
      <div
        className={styles.galleryPanel}
        role="tabpanel"
        id={`demo-panel-${activeDemo.id}`}
        aria-labelledby={`demo-tab-${activeDemo.id}`}
      >
        <div className={styles.galleryMeta}>
          <div>
            <span className={styles.internalBadge}>Internal demo</span>
            <p>{activeDemo.description}</p>
          </div>
          <span className={styles.demoDuration}>1080P · {activeDemo.duration}</span>
        </div>
        <DemoCanvas demo={activeDemo} />
        <div className={styles.galleryCaption}>
          <h3>{activeDemo.title}</h3>
          <div className={styles.outputTags}>
            <span>Release video</span><span>X copy</span><span>LinkedIn copy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoCanvas({ demo }: { demo: DemoExample }) {
  return (
    <div className={`${styles.demoCanvas} ${styles[`accent_${demo.accent}`]}`}>
      <div className={styles.demoChrome}>
        <span /><span /><span />
        <div>releaseflow / internal-demo / {demo.id}</div>
        <span className={styles.liveDot}>LIVE</span>
      </div>
      <div className={styles.demoStage}>
        <div className={styles.demoProduct}>
          <div className={styles.demoSidebar}>
            <span className={styles.demoMiniMark}>F</span>
            {Array.from({ length: 5 }, (_, index) => <i key={index} />)}
          </div>
          <div className={styles.demoWorkspace}>
            <div className={styles.demoWorkspaceTop}><span /> <span /></div>
            <div className={styles.demoSearchLine}>{demo.label}<kbd>⌘ K</kbd></div>
            <div className={styles.demoResults}>
              <span className={styles.activeResult} /><span /><span />
            </div>
          </div>
        </div>
        <div className={styles.demoHook}>
          <span>FEATURE RELEASE / {demo.duration}</span>
          <strong>{demo.hook}</strong>
        </div>
        <div className={styles.demoCopyCard}>
          <span>LAUNCH COPY</span>
          <p>{demo.post}</p>
          <div><i /><i /><i /></div>
        </div>
        <div className={styles.demoTimeline}>
          <span>00:00</span><div><i /></div><span>{demo.duration}</span>
        </div>
      </div>
    </div>
  );
}

type TransformationSide = {
  readonly label: string;
  readonly title: string;
  readonly items: readonly string[];
};

export function BeforeAfter({ before, after }: { before: TransformationSide; after: TransformationSide }) {
  const [side, setSide] = useState<"before" | "after">("after");
  const active = side === "before" ? before : after;

  return (
    <div className={styles.transformShell}>
      <div className={styles.transformSwitch} role="group" aria-label="Compare raw handoff and Release Pack">
        <button type="button" aria-pressed={side === "before"} onClick={() => setSide("before")}>Before</button>
        <button type="button" aria-pressed={side === "after"} onClick={() => setSide("after")}>After</button>
      </div>
      <div className={`${styles.transformPanel} ${side === "after" ? styles.transformAfter : ""}`}>
        <div className={styles.transformPanelTop}>
          <span>{active.label}</span>
          <span>{side === "before" ? "INPUT / UNSTRUCTURED" : "OUTPUT / RELEASE-READY"}</span>
        </div>
        <h3>{active.title}</h3>
        <ul>
          {active.items.map((item, index) => (
            <li key={item}><span>{side === "before" ? "—" : "✓"}</span><b>0{index + 1}</b>{item}</li>
          ))}
        </ul>
        <div className={styles.transformProgress}><span /></div>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}
