"use client";

import { type ChangeEvent, type DragEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics/track";
import type {
  RegenerationIntent,
  ReleaseErrorCode,
  ReleaseRecord,
  ReleaseStage,
} from "@/lib/release/types";
import { limits } from "@/lib/config";
import { DEFAULT_LOCALE, locales, type Locale } from "@/locales";

type View = "create" | "processing" | "result";
type SocialTab = "x" | "linkedin";

const PROCESSING_STAGES = [
  "uploading",
  "validating",
  "analyzing",
  "planning",
  "rendering",
  "finalizing",
] as const satisfies readonly ReleaseStage[];
type ProcessingStage = (typeof PROCESSING_STAGES)[number];

export function ReleaseFlowApp() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [view, setView] = useState<View>("create");
  const [file, setFile] = useState<File>();
  const [featureName, setFeatureName] = useState("");
  const [description, setDescription] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [release, setRelease] = useState<ReleaseRecord>();
  const [errorCode, setErrorCode] = useState<ReleaseErrorCode>();
  const [isDragging, setIsDragging] = useState(false);
  const [socialTab, setSocialTab] = useState<SocialTab>("x");
  const [copied, setCopied] = useState<SocialTab>();
  const [showRegenerate, setShowRegenerate] = useState(false);
  const [regenerateIntent, setRegenerateIntent] = useState<RegenerationIntent>("shorter");
  const [customInstruction, setCustomInstruction] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = locales[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [locale]);

  function selectLocale(nextLocale: Locale) {
    setLocale(nextLocale);
  }

  function selectFile(selected?: File) {
    if (!selected) return;
    setErrorCode(undefined);
    setFile(selected);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorCode(undefined);
    if (!file || !featureName.trim() || !description.trim()) {
      setErrorCode("invalid_request");
      return;
    }
    if (file.size > limits.maxUploadBytes) {
      setErrorCode("file_too_large");
      return;
    }
    if (productUrl && !isHttpUrl(productUrl)) {
      setErrorCode("invalid_request");
      return;
    }

    try {
      setView("processing");
      const createResponse = await fetch("/api/releases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureName, description, productUrl: productUrl || undefined }),
      });
      const created = await parseApiResponse(createResponse);
      setRelease(created.release);

      const uploadResponse = await fetch(`/api/releases/${created.release.id}/upload`, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
          "X-File-Name": encodeURIComponent(file.name),
        },
        body: file,
      });
      if (!uploadResponse.ok) await parseApiResponse(uploadResponse);
      await pollUntilComplete(created.release.id, setRelease);
      const finalResponse = await fetch(`/api/releases/${created.release.id}`, { cache: "no-store" });
      const finalPayload = await parseApiResponse(finalResponse);
      setRelease(finalPayload.release);
      setView("result");
      track("video_previewed", { releaseId: created.release.id });
    } catch (error) {
      setErrorCode(error instanceof ApiError ? error.code : "internal_error");
      setView("create");
    }
  }

  async function copySocial(tab: SocialTab) {
    const value = tab === "x" ? release?.copy?.xPost : release?.copy?.linkedinPost;
    const releaseId = release?.id;
    if (!value || !releaseId) return;
    await navigator.clipboard.writeText(value);
    setCopied(tab);
    track(tab === "x" ? "x_copy_copied" : "linkedin_copy_copied", { releaseId });
    window.setTimeout(() => setCopied(undefined), 1800);
  }

  function reset() {
    setView("create");
    setFile(undefined);
    setFeatureName("");
    setDescription("");
    setProductUrl("");
    setRelease(undefined);
    setErrorCode(undefined);
    setShowRegenerate(false);
    setRegenerateIntent("shorter");
    setCustomInstruction("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function regenerate() {
    if (!release) return;
    if (regenerateIntent === "custom" && !customInstruction.trim()) {
      setErrorCode("invalid_request");
      return;
    }
    setErrorCode(undefined);
    setShowRegenerate(false);
    setView("processing");
    track("regenerate_submitted", { releaseId: release.id, intent: regenerateIntent });
    try {
      const response = await fetch(`/api/releases/${release.id}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: regenerateIntent,
          ...(regenerateIntent === "custom"
            ? { customInstruction: customInstruction.trim() }
            : {}),
        }),
      });
      await parseApiResponse(response);
      await pollUntilComplete(release.id, setRelease);
      const finalResponse = await fetch(`/api/releases/${release.id}`, { cache: "no-store" });
      const finalPayload = await parseApiResponse(finalResponse);
      setRelease(finalPayload.release);
      setView("result");
    } catch (error) {
      setErrorCode(error instanceof ApiError ? error.code : "internal_error");
      setView("result");
    }
  }

  const displayedError = errorCode
    ? errorCode === "invalid_request"
      ? productUrl && !isHttpUrl(productUrl)
        ? t.errors.invalidUrl
        : t.errors.requiredFields
      : t.errors[errorCode]
    : undefined;

  return (
    <main className="site-shell">
      <header className="nav container">
        <button type="button" className="brand-lockup" onClick={reset}>
          <span className="brand-mark">R</span>
          <span>ReleaseFlow</span>
        </button>
        <div className="nav-actions">
          <span className="nav-badge"><SparkIcon />{t.nav.badge}</span>
          <div className="locale-switch" aria-label={t.misc.language}>
            {(Object.keys(locales) as Locale[]).map((language) => (
              <button
                type="button"
                key={language}
                className={language === locale ? "active" : ""}
                onClick={() => selectLocale(language)}
                aria-pressed={language === locale}
              >
                {language.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="text-button"
            onClick={() => {
              track("pricing_viewed");
              track("founder_plan_clicked");
            }}
          >
            {t.nav.pricing}
          </button>
        </div>
      </header>

      {view === "create" && (
        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" />{t.hero.eyebrow}</div>
            <h1>{t.hero.title}<span>{t.hero.titleAccent}</span></h1>
            <p className="hero-description">{t.hero.description}</p>
            <div className="trust-line"><CheckBadgeIcon />{t.hero.trust}</div>
            <div className="flow-visual" aria-hidden="true">
              <div className="flow-node"><VideoIcon /></div><span />
              <div className="flow-node"><WandIcon /></div><span />
              <div className="flow-node accent"><PackageIcon /></div>
            </div>
          </div>

          <form className="release-card" onSubmit={submit}>
            <div className="card-heading">
              <span className="card-icon"><PlusIcon /></span>
              <div><h2>{t.form.title}</h2><p>{t.form.subtitle}</p></div>
            </div>

            {displayedError && <div className="error-banner" role="alert"><AlertIcon />{displayedError}</div>}

            <div className="field-group">
              <div className="field-label-row"><label htmlFor="recording">{t.form.recordingLabel}</label><span>{t.form.recordingHint}</span></div>
              <input ref={fileInputRef} id="recording" className="sr-only" type="file" accept="video/mp4,video/quicktime,.mp4,.mov" onChange={onFileChange} />
              <button
                type="button"
                className={`dropzone ${isDragging ? "dragging" : ""} ${file ? "selected" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
              >
                <span className="upload-icon">{file ? <CheckIcon /> : <UploadIcon />}</span>
                <span className="dropzone-copy">
                  <strong>{file ? t.form.recordingSelected : t.form.recordingEmpty}</strong>
                  {file && <small>{file.name} · {formatBytes(file.size)}</small>}
                </span>
                {file && <span className="replace-label">{t.form.replace}</span>}
              </button>
            </div>

            <div className="field-group">
              <label htmlFor="feature-name">{t.form.featureNameLabel}</label>
              <input id="feature-name" value={featureName} onChange={(event) => setFeatureName(event.target.value)} maxLength={limits.maxFeatureNameLength} placeholder={t.form.featureNamePlaceholder} />
            </div>
            <div className="field-group">
              <label htmlFor="description">{t.form.descriptionLabel}</label>
              <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} maxLength={limits.maxDescriptionLength} rows={4} placeholder={t.form.descriptionPlaceholder} />
              <span className="character-count">{description.length} / {limits.maxDescriptionLength}</span>
            </div>
            <div className="field-group">
              <div className="field-label-row"><label htmlFor="product-url">{t.form.productUrlLabel}</label><span>{t.form.optional}</span></div>
              <input id="product-url" type="url" value={productUrl} onChange={(event) => setProductUrl(event.target.value)} maxLength={limits.maxProductUrlLength} placeholder={t.form.productUrlPlaceholder} />
            </div>

            <div className="form-footer-note"><GlobeIcon />{t.form.outputLanguage}</div>
            <button className="primary-button" type="submit"><SparkIcon />{t.form.generate}<ArrowIcon /></button>
            <p className="privacy-note"><LockIcon />{t.form.privacy}</p>
          </form>
        </section>
      )}

      {view === "processing" && (
        <ProcessingView release={release} t={t} />
      )}

      {view === "result" && release?.copy && release.videoUrl && (
        <section className="result-section container">
          <div className="result-heading">
            <span className="success-orbit"><CheckIcon /></span>
            <p>{t.result.ready}</p>
            <h1>{t.result.done}</h1>
          </div>
          <div className="result-grid">
            <article className="video-card">
              <div className="result-card-header"><div><span className="mini-label">{t.result.videoKind}</span><h2>{t.result.video}</h2></div><span className="ready-badge"><CheckIcon />{t.result.readyBadge}</span></div>
              <div className="video-frame">
                <video controls playsInline preload="metadata" src={release.videoUrl} aria-label={t.result.previewLabel} />
              </div>
              <a
                className="download-button"
                href={withDownload(release.videoUrl)}
                onClick={() => track("video_downloaded", { releaseId: release.id })}
              ><DownloadIcon />{t.result.download}</a>
            </article>

            <article className="social-card">
              <div className="social-tabs">
                <button type="button" className={socialTab === "x" ? "active" : ""} onClick={() => setSocialTab("x")}>{t.result.xPost}<span><CheckIcon /></span></button>
                <button type="button" className={socialTab === "linkedin" ? "active" : ""} onClick={() => setSocialTab("linkedin")}>{t.result.linkedinPost}<span><CheckIcon /></span></button>
              </div>
              <div className="social-copy"><pre>{socialTab === "x" ? release.copy.xPost : release.copy.linkedinPost}</pre></div>
              <button type="button" className="copy-button" onClick={() => copySocial(socialTab)}><CopyIcon />{copied === socialTab ? t.result.copied : t.result.copy}</button>
            </article>
          </div>
          <div className="result-actions">
            <button type="button" className="secondary-button" onClick={() => { setShowRegenerate((value) => !value); setErrorCode(undefined); track("regenerate_clicked", { releaseId: release.id }); }}><RefreshIcon />{t.result.regenerate}</button>
            <button type="button" className="text-action" onClick={reset}>{t.result.newRelease}<ArrowIcon /></button>
          </div>
          {showRegenerate && (
            <div className="regenerate-panel">
              <div className="regenerate-heading"><h2>{t.result.regenerateTitle}</h2><p>{t.result.regenerateSubtitle}</p></div>
              {errorCode && <div className="error-banner" role="alert"><AlertIcon />{t.errors[errorCode]}</div>}
              <div className="intent-grid">
                {([
                  ["shorter", t.result.shorter],
                  ["energetic", t.result.energetic],
                  ["focus_results", t.result.focusResults],
                  ["less_text", t.result.lessText],
                  ["professional", t.result.professional],
                  ["custom", t.result.custom],
                ] as const).map(([intent, label]) => (
                  <button
                    type="button"
                    key={intent}
                    className={regenerateIntent === intent ? "active" : ""}
                    aria-pressed={regenerateIntent === intent}
                    onClick={() => setRegenerateIntent(intent)}
                  >{label}</button>
                ))}
              </div>
              {regenerateIntent === "custom" && (
                <textarea
                  value={customInstruction}
                  onChange={(event) => setCustomInstruction(event.target.value)}
                  maxLength={limits.maxRegenerationInstructionLength}
                  rows={3}
                  placeholder={t.result.customPlaceholder}
                  aria-label={t.result.custom}
                />
              )}
              <div className="regenerate-buttons">
                <button type="button" className="secondary-button" onClick={() => setShowRegenerate(false)}>{t.result.cancel}</button>
                <button type="button" className="primary-button compact" onClick={regenerate}><RefreshIcon />{t.result.applyRegenerate}</button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

function ProcessingView({ release, t }: { release?: ReleaseRecord; t: (typeof locales)[Locale] }) {
  const currentStage = PROCESSING_STAGES.includes(release?.stage as ProcessingStage)
    ? release?.stage as ProcessingStage
    : "uploading";
  const activeIndex = PROCESSING_STAGES.indexOf(currentStage);
  const stageLabels: Record<ProcessingStage, string> = {
    uploading: t.processing.uploading,
    validating: t.processing.validating,
    analyzing: t.processing.analyzing,
    planning: t.processing.planning,
    rendering: t.processing.rendering,
    finalizing: t.processing.finalizing,
  };
  return (
    <section className="processing-section container">
      <div className="processing-visual"><div className="processing-ring"><SparkIcon /></div><span className="orbit-dot" /></div>
      <h1>{t.processing.title}</h1>
      <p>{t.processing.subtitle}</p>
      <div className="progress-card">
        <div className="progress-top"><strong>{release ? stageLabels[currentStage] : t.processing.uploading}</strong><span>{release?.progress || 5}%</span></div>
        <div className="progress-track"><span style={{ width: `${release?.progress || 5}%` }} /></div>
        <div className="stage-list">
          {PROCESSING_STAGES.map((stage, index) => (
            <div className={`stage-item ${index < activeIndex ? "complete" : ""} ${index === activeIndex ? "active" : ""}`} key={stage}>
              <span className="stage-dot">{index < activeIndex ? <CheckIcon /> : index + 1}</span><span>{stageLabels[stage]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function pollUntilComplete(id: string, onUpdate: (release: ReleaseRecord) => void) {
  for (let attempt = 0; attempt < 240; attempt += 1) {
    await new Promise((resolve) => window.setTimeout(resolve, 1000));
    const response = await fetch(`/api/releases/${id}`, { cache: "no-store" });
    const payload = await parseApiResponse(response);
    onUpdate(payload.release);
    if (payload.release.stage === "completed") return;
    if (payload.release.stage === "failed") {
      throw new ApiError(payload.release.errorCode || "internal_error");
    }
  }
  throw new ApiError("internal_error");
}

async function parseApiResponse(response: Response): Promise<{ release: ReleaseRecord }> {
  const payload = await response.json() as { release?: ReleaseRecord; errorCode?: ReleaseErrorCode };
  if (!response.ok || !payload.release) throw new ApiError(payload.errorCode || "internal_error");
  return { release: payload.release };
}

class ApiError extends Error {
  constructor(readonly code: ReleaseErrorCode) {
    super(code);
  }
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function formatBytes(bytes: number): string {
  return bytes < 1024 * 1024 ? `${Math.ceil(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function withDownload(videoUrl: string): string {
  return `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}download=1`;
}

function SparkIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l1.35 5.65L19 9l-5.65 1.35L12 16l-1.35-5.65L5 9l5.65-1.35L12 2zM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15z" /></svg>; }
function CheckBadgeIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.2 1.5 2.7-.1.8 2.6 2.2 1.6-.9 2.5.9 2.5-2.2 1.6-.8 2.6-2.7-.1L12 19.2l-2.2-1.5-2.7.1-.8-2.6-2.2-1.6.9-2.5-.9-2.5L6.3 7l.8-2.6 2.7.1L12 3z"/><path d="M8.5 11.5l2.1 2.1 4.8-5" className="stroke" /></svg>; }
function VideoIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="14" height="14" rx="3"/><path d="M17 10l4-2v8l-4-2" /></svg>; }
function WandIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20L17 7M14 4l6 6M6 3v3M4.5 4.5h3M18 15v4M16 17h4" /></svg>; }
function PackageIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7l8-4 8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10" /></svg>; }
function PlusIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>; }
function AlertIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2L12 3zM12 9v5M12 17.5v.5" /></svg>; }
function UploadIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 15v4h14v-4" /></svg>; }
function CheckIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>; }
function GlobeIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></svg>; }
function ArrowIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M14 7l5 5-5 5" /></svg>; }
function LockIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 018 0v3" /></svg>; }
function DownloadIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M4 20h16" /></svg>; }
function CopyIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="12" rx="2"/><path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h3" /></svg>; }
function RefreshIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5M18.5 9A7 7 0 006.2 6.2L4 9M5.5 15A7 7 0 0017.8 17.8L20 15" /></svg>; }
