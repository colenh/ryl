/**
 * Export brand assets (SVG + PNG) from config.ts colors and school info.
 *
 * Usage:
 *   bun run scripts/export-brand.ts
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { config } from "../src/config";

function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = Number.parseInt(c.slice(0, 2), 16) / 255;
  const g = Number.parseInt(c.slice(2, 4), 16) / 255;
  const b = Number.parseInt(c.slice(4, 6), 16) / 255;
  const lin = (v: number) =>
    v <= 0.039_28 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastFg(bg: string): "#ffffff" | "#000000" {
  const l = luminance(bg);
  return 1.05 / (l + 0.05) >= (l + 0.05) / 0.05 ? "#ffffff" : "#000000";
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const { colors } = config.brand;
const { name, shortName } = config.school;

const primaryFg = contrastFg(colors.primary);
const pennantColor = colors.pennant || colors.secondary;
const pennantFg =
  colors.pennantFg ||
  (contrastRatio(colors.primary, pennantColor) >= 3
    ? colors.primary
    : contrastFg(pennantColor));
const navbarColor = colors.navbar || colors.primary;
const navbarFg = contrastFg(navbarColor);

const fontB64 = readFileSync(
  "public/font/gt-america/GT-America-Condensed-Bold-Trial.otf"
).toString("base64");
const fontDefs = `<defs><style>@font-face{font-family:'GT America Condensed';font-weight:700;src:url('data:font/otf;base64,${fontB64}') format('opentype');}</style></defs>`;
const fontAttrs = `font-family="'GT America Condensed','Helvetica Neue Condensed Bold','Arial Narrow',sans-serif" font-weight="700"`;

function faviconSvg(size: number, withText = false, rounded = true): string {
  const rx = rounded ? Math.round(size * 0.15) : 0;
  const pts = [
    `${size * 0.22},${size * 0.16}`,
    `${size * 0.91},${size * 0.5}`,
    `${size * 0.22},${size * 0.84}`,
  ].join(" ");
  let text = "";
  if (withText) {
    const fs = Math.min(
      size * 0.3,
      (size * 0.58) / (shortName.length * 0.72 + 0.71)
    );
    const y = size * 0.5 + fs * 0.35;
    text = `<text x="${size * 0.33}" y="${y}" font-size="${fs}" fill="${pennantFg}" ${fontAttrs}>${shortName}</text>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  ${withText ? fontDefs : ""}
  <rect width="${size}" height="${size}" rx="${rx}" fill="${colors.primary}"/>
  <polygon points="${pts}" fill="${pennantColor}"/>
  <rect x="${size * 0.22}" y="${size * 0.16}" width="${size * 0.09}" height="${size * 0.68}" fill="${primaryFg}"/>
  ${text}
</svg>`;
}

function headerLogoSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1114 420" width="1114" height="420" ${fontAttrs}>
  ${fontDefs}
  <rect width="1114" height="420" fill="${navbarColor}"/>
  <path d="M495 39 L1060 150 L495 266 Z" fill="${pennantColor}"/>
  <path d="M495 39 L515 43 L515 262 L495 266 Z" fill="${navbarFg}"/>
  <text x="10" y="254" font-size="290" fill="${navbarFg}">RYL</text>
  <text x="10" y="371" font-size="112" fill="${navbarFg}">${name}</text>
</svg>`;
}

function headerLogoTransparentSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1114 420" width="1114" height="420" ${fontAttrs}>
  ${fontDefs}
  <path d="M495 39 L1060 150 L495 266 Z" fill="${pennantColor}"/>
  <path d="M495 39 L515 43 L515 262 L495 266 Z" fill="${colors.primary}"/>
  <text x="10" y="254" font-size="290" fill="${colors.primary}">RYL</text>
  <text x="10" y="371" font-size="112" fill="${colors.primary}">${name}</text>
</svg>`;
}

function homepageLogoSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1582 346" width="1582" height="346" ${fontAttrs}>
  ${fontDefs}
  <path d="M845 20 L1580 173 L845 325 Z" fill="${pennantColor}"/>
  <path d="M845 20 L872 26 L872 319 L845 325 Z" fill="${pennantFg}"/>
  <text x="0" y="141" font-size="166" fill="${colors.primary}">RATE YOUR</text>
  <text x="0" y="323" font-size="166" fill="${colors.primary}">LANDLORD</text>
  <text x="892" y="220" font-size="130" fill="${pennantFg}">${shortName}</text>
</svg>`;
}

function pennantSvg(withText = true): string {
  const fs = Math.min(150, 655 / (shortName.length * 0.72 + 1.68));
  const text = withText
    ? `<text x="80" y="${153 + fs * 0.35}" font-size="${fs}" fill="${pennantFg}">${shortName}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 736 306" width="736" height="306" ${fontAttrs}>
  ${withText ? fontDefs : ""}
  <path d="M0 0 L735 153 L0 306 Z" fill="${pennantColor}"/>
  <rect x="0" y="0" width="27" height="306" fill="${pennantFg}"/>
  ${text}
</svg>`;
}

const outDir = "brand-exports";
mkdirSync(outDir, { recursive: true });

const svgs: [string, string][] = [
  ["favicon-32.svg", faviconSvg(32)],
  ["favicon-512.svg", faviconSvg(512)],
  ["favicon-32-text.svg", faviconSvg(32, true)],
  ["favicon-512-text.svg", faviconSvg(512, true)],
  ["social-512.svg", faviconSvg(512, false, false)],
  ["social-512-text.svg", faviconSvg(512, true, false)],
  ["logo-header.svg", headerLogoSvg()],
  ["logo-header-transparent.svg", headerLogoTransparentSvg()],
  ["logo-homepage.svg", homepageLogoSvg()],
  ["pennant.svg", pennantSvg(false)],
  ["pennant-text.svg", pennantSvg(true)],
];

for (const [filename, content] of svgs) {
  writeFileSync(`${outDir}/${filename}`, content);
  console.log(`✓ ${outDir}/${filename}`);
}

const resvgOpts = {
  font: {
    fontFiles: ["public/font/gt-america/GT-America-Condensed-Bold-Trial.otf"],
    loadSystemFonts: false,
    defaultFontFamily: "GT America Condensed",
  },
};

const pngs: [string, string][] = [
  ["favicon-32.png", "favicon-32.svg"],
  ["favicon-512.png", "favicon-512.svg"],
  ["favicon-32-text.png", "favicon-32-text.svg"],
  ["favicon-512-text.png", "favicon-512-text.svg"],
  ["social-512.png", "social-512.svg"],
  ["social-512-text.png", "social-512-text.svg"],
  ["logo-header.png", "logo-header.svg"],
  ["logo-header-transparent.png", "logo-header-transparent.svg"],
  ["logo-homepage.png", "logo-homepage.svg"],
  ["pennant.png", "pennant.svg"],
  ["pennant-text.png", "pennant-text.svg"],
];

for (const [out, src] of pngs) {
  const svg = readFileSync(`${outDir}/${src}`, "utf8");
  const resvg = new Resvg(svg, resvgOpts);
  writeFileSync(`${outDir}/${out}`, resvg.render().asPng());
  console.log(`✓ ${outDir}/${out}`);
}
