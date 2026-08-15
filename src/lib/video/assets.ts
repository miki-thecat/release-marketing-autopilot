import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import type { ReleaseCopy, ReleaseDetails } from "@/lib/release/types";

export interface RenderAssets {
  intro: string;
  browser: string;
  outro: string;
}

export async function createRenderAssets(
  directory: string,
  details: ReleaseDetails,
  copy: ReleaseCopy,
): Promise<RenderAssets> {
  const intro = path.join(directory, "intro.png");
  const browser = path.join(directory, "browser.png");
  const outro = path.join(directory, "outro.png");

  await Promise.all([
    svgToPng(introSvg(copy.hook, details.featureName), intro),
    svgToPng(browserSvg(details), browser),
    svgToPng(outroSvg(copy.cta, details.productUrl), outro),
  ]);

  return { intro, browser, outro };
}

async function svgToPng(svg: string, destination: string): Promise<void> {
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(destination, png);
}

function introSvg(hook: string, featureName: string): string {
  const lines = wrap(hook, 30, 2);
  return baseSvg(`
    <circle cx="1640" cy="82" r="430" fill="url(#halo)" opacity=".56" />
    <circle cx="250" cy="1060" r="390" fill="#d9fff3" opacity=".55" />
    ${brand(110, 100)}
    <text x="960" y="450" text-anchor="middle" class="eyebrow">NEW FEATURE · ${xml(featureName.toUpperCase())}</text>
    <text x="960" y="555" text-anchor="middle" class="display">${tspans(lines, 960, 0, 94)}</text>
    <rect x="820" y="820" width="280" height="4" rx="2" fill="#15b87a" />
  `);
}

function browserSvg(details: ReleaseDetails): string {
  const host = safeHost(details.productUrl);
  return baseSvg(`
    <circle cx="1760" cy="10" r="460" fill="url(#halo)" opacity=".42" />
    <circle cx="-80" cy="1080" r="520" fill="#dff8f0" opacity=".65" />
    ${brand(94, 65)}
    <text x="1826" y="96" text-anchor="end" class="label">${xml(details.featureName)}</text>
    <rect x="190" y="100" width="1540" height="920" rx="32" fill="#ffffff" filter="url(#shadow)" />
    <path d="M222 100h1476a32 32 0 0 1 32 32v56H190v-56a32 32 0 0 1 32-32z" fill="#f7f8fa" />
    <circle cx="236" cy="144" r="8" fill="#ff6b6b" />
    <circle cx="264" cy="144" r="8" fill="#f7c948" />
    <circle cx="292" cy="144" r="8" fill="#43c795" />
    <rect x="600" y="121" width="720" height="45" rx="13" fill="#ffffff" stroke="#e5e9ef" />
    <circle cx="631" cy="144" r="7" fill="none" stroke="#8e99a8" stroke-width="2" />
    <path d="M636 149l6 6" stroke="#8e99a8" stroke-width="2" stroke-linecap="round" />
    <text x="960" y="151" text-anchor="middle" class="url">${xml(host)}</text>
    <rect x="226" y="181" width="1468" height="829" rx="10" fill="#0f172a" />
  `);
}

function outroSvg(cta: string, productUrl?: string): string {
  const lines = wrap(cta, 32, 2);
  const host = safeHost(productUrl);
  return baseSvg(`
    <circle cx="1650" cy="180" r="470" fill="url(#halo)" opacity=".58" />
    <circle cx="300" cy="960" r="390" fill="#d9fff3" opacity=".58" />
    ${brand(110, 100)}
    <rect x="836" y="305" width="248" height="46" rx="23" fill="#e1f9ef" />
    <text x="960" y="337" text-anchor="middle" class="pill">AVAILABLE NOW</text>
    <text x="960" y="520" text-anchor="middle" class="display">${tspans(lines, 960, 0, 94)}</text>
    <rect x="760" y="790" width="400" height="74" rx="20" fill="#14231f" />
    <text x="960" y="838" text-anchor="middle" class="button">${xml(host)}</text>
  `);
}

function baseSvg(content: string): string {
  return `<svg width="1920" height="1080" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fbfcfc"/><stop offset="1" stop-color="#eef3f1"/></linearGradient>
      <radialGradient id="halo"><stop stop-color="#b8f2dd"/><stop offset="1" stop-color="#dff8ef" stop-opacity="0"/></radialGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="26" stdDeviation="28" flood-color="#182b25" flood-opacity=".16"/></filter>
      <style>
        text { font-family: "Inter", "Segoe UI", "Noto Sans", Arial, sans-serif; fill: #14231f; }
        .display { font-size: 82px; font-weight: 720; letter-spacing: -3px; }
        .eyebrow { font-size: 24px; font-weight: 700; letter-spacing: 4px; fill: #16835f; }
        .brand { font-size: 25px; font-weight: 720; letter-spacing: -.5px; }
        .mark { font-size: 19px; font-weight: 800; fill: #fff; }
        .label { font-size: 22px; font-weight: 650; fill: #51605b; }
        .url { font-size: 17px; fill: #7f8b87; }
        .pill { font-size: 18px; font-weight: 750; letter-spacing: 2px; fill: #16835f; }
        .button { font-size: 22px; font-weight: 650; fill: #fff; }
      </style>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg)" />
    ${content}
  </svg>`;
}

function brand(x: number, y: number): string {
  return `<rect x="${x}" y="${y}" width="40" height="40" rx="12" fill="#14231f"/><text x="${x + 20}" y="${y + 27}" text-anchor="middle" class="mark">R</text><text x="${x + 54}" y="${y + 28}" class="brand">ReleaseFlow</text>`;
}

function tspans(lines: string[], x: number, firstDy: number, lineHeight: number): string {
  return lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? firstDy : lineHeight}">${xml(line)}</tspan>`).join("");
}

function wrap(value: string, maxCharacters: number, maxLines: number): string[] {
  const words = value.trim().split(/\s+/);
  const lines: string[] = [];
  for (const word of words) {
    const current = lines.at(-1);
    if (!current || (current.length + word.length + 1 > maxCharacters && lines.length < maxLines)) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  }
  if (lines.length > maxLines) lines.length = maxLines;
  const last = lines.at(-1) || value;
  if (last.length > maxCharacters * 1.35) {
    lines[lines.length - 1] = `${last.slice(0, Math.floor(maxCharacters * 1.35) - 1)}…`;
  }
  return lines;
}

function xml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]!);
}

function safeHost(productUrl?: string): string {
  if (!productUrl) return "Available now";
  try {
    return new URL(productUrl).host;
  } catch {
    return "Available now";
  }
}
