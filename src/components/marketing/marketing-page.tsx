import Link from "next/link";
import { marketingContent } from "@/content/marketing";
import { BeforeAfter, DemoGallery, MobileNavigation } from "./marketing-interactions";
import { ProductEntryAdapter } from "./product-entry-adapter";
import styles from "./marketing.module.css";

const content = marketingContent;

export function MarketingPage() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <SiteHeader />

      <div id="main-content">
        <section className={styles.hero}>
          <div className={styles.heroGrid} aria-hidden="true" />
          <div className={styles.container}>
            <div className={styles.heroCopy}>
              <SectionLabel>{content.hero.eyebrow}</SectionLabel>
              <h1>{content.hero.title}</h1>
              <p>{content.hero.description}</p>
              <div className={styles.heroNote}><span />{content.hero.note}</div>
            </div>
            <ProductEntryAdapter content={content.productEntry} />
          </div>
          <div className={styles.heroRail} aria-hidden="true">
            <span>01 / INPUT</span><span>RELEASEFLOW WEB V2</span><span>OUTPUT / 03</span>
          </div>
        </section>

        <section className={styles.proofSection} id="examples">
          <div className={styles.container}>
            <SectionHeading
              eyebrow={content.proof.eyebrow}
              title={content.proof.title}
              description={content.proof.description}
            />
            <DemoGallery demos={content.demos} />
          </div>
        </section>

        <section className={styles.transformationSection}>
          <div className={`${styles.container} ${styles.twoColumnIntro}`}>
            <div>
              <SectionLabel>{content.transformation.eyebrow}</SectionLabel>
              <h2>{content.transformation.title}</h2>
            </div>
            <p>{content.transformation.description}</p>
          </div>
          <div className={styles.container}>
            <BeforeAfter before={content.transformation.before} after={content.transformation.after} />
          </div>
        </section>

        <section className={styles.processSection} id="how-it-works">
          <div className={styles.container}>
            <SectionHeading eyebrow={content.process.eyebrow} title={content.process.title} />
            <div className={styles.stepGrid}>
              {content.process.steps.map((step) => (
                <article key={step.number}>
                  <span>{step.number}</span>
                  <div className={styles.stepGlyph} aria-hidden="true"><i /><i /><i /></div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.capabilitySection}>
          <div className={`${styles.container} ${styles.capabilityGrid}`}>
            <div className={styles.capabilityCopy}>
              <SectionLabel inverse>{content.capability.eyebrow}</SectionLabel>
              <h2>{content.capability.title}</h2>
              <p>{content.capability.description}</p>
              <ul>
                {content.capability.points.map((point, index) => (
                  <li key={point}><span>0{index + 1}</span>{point}</li>
                ))}
              </ul>
            </div>
            <CapabilityVisual />
          </div>
        </section>

        <section className={styles.useCaseSection} id="use-cases">
          <div className={styles.container}>
            <div className={styles.useCaseHeading}>
              <div>
                <SectionLabel>{content.useCases.eyebrow}</SectionLabel>
                <h2>{content.useCases.title}</h2>
              </div>
              <p>{content.useCases.description}</p>
            </div>
            <div className={styles.useCaseGrid}>
              {content.useCases.items.map((item, index) => (
                <article key={item.kicker}>
                  <div><span>0{index + 1}</span><i /></div>
                  <p>{item.kicker}</p>
                  <h3>{item.title}</h3>
                  <ArrowIcon />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.faqSection} id="faq">
          <div className={`${styles.container} ${styles.faqGrid}`}>
            <div className={styles.faqHeading}>
              <SectionLabel>{content.faq.eyebrow}</SectionLabel>
              <h2>{content.faq.title}</h2>
              <p>Current product answers are provisional and live in the replaceable content layer.</p>
            </div>
            <div className={styles.faqList}>
              {content.faq.items.map((item, index) => (
                <details key={item.question} name="releaseflow-faq" open={index === 0}>
                  <summary><span>0{index + 1}</span>{item.question}<i /></summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.finalCta}>
          <div className={styles.ctaOrb} aria-hidden="true" />
          <div className={styles.container}>
            <SectionLabel inverse>{content.finalCta.eyebrow}</SectionLabel>
            <h2>{content.finalCta.title}</h2>
            <Link href="/create" className={styles.ctaLink}>
              <span>{content.finalCta.action}<small>{content.finalCta.note}</small></span>
              <i><ArrowIcon /></i>
            </Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

function SiteHeader() {
  return (
    <header className={styles.siteHeader}>
      <div className={`${styles.container} ${styles.headerInner}`}>
        <Link href="/" className={styles.logo} aria-label="ReleaseFlow home">
          <LogoMark /><span>ReleaseFlow</span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {content.nav.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
        <Link className={styles.headerCta} href="/create">Open app <ArrowIcon /></Link>
        <MobileNavigation items={content.nav} />
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} ${styles.footerTop}`}>
        <Link href="/" className={styles.footerLogo}><LogoMark /><span>ReleaseFlow</span></Link>
        <p>Technical precision for the moment your product becomes a story.</p>
        <nav aria-label="Footer navigation">
          {content.nav.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
          <Link href="/create">Create</Link>
        </nav>
      </div>
      <div className={`${styles.container} ${styles.footerBottom}`}>
        <span>© {new Date().getFullYear()} ReleaseFlow</span>
        <span>WEB V2 / PROVISIONAL PRODUCT STORY</span>
      </div>
    </footer>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className={styles.sectionHeading}>
      <SectionLabel>{eyebrow}</SectionLabel>
      <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
    </div>
  );
}

function SectionLabel({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return <div className={`${styles.sectionLabel} ${inverse ? styles.sectionLabelInverse : ""}`}><span />{children}</div>;
}

function CapabilityVisual() {
  return (
    <div className={styles.capabilityVisual} aria-label="Illustration of coordinated ReleaseFlow outputs">
      <div className={styles.capabilityTopbar}><span /><b>RELEASE / AI SEARCH</b><i>PROCESS COMPLETE</i></div>
      <div className={styles.capabilityStage}>
        <div className={styles.capVideo}>
          <span>VIDEO / 1080P</span>
          <strong>Search everything.<br />Find what matters.</strong>
          <div><i /><i /></div>
        </div>
        <div className={styles.capCopy}>
          <span>LAUNCH COPY</span>
          <p>Your workspace finally answers back. AI Search is now live across projects, tasks, and docs.</p>
          <div><i /><i /><i /></div>
        </div>
        <div className={styles.capTimeline}>
          <span>STORYBOARD</span><div><i /><i /><i /><i /></div>
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return <span className={styles.logoMark} aria-hidden="true"><i /><i /></span>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>;
}
