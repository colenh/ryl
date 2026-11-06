import { config } from "@/config";

function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = Number.parseInt(c.slice(0, 2), 16) / 255;
  const g = Number.parseInt(c.slice(2, 4), 16) / 255;
  const b = Number.parseInt(c.slice(4, 6), 16) / 255;
  const lin = (v: number) =>
    v <= 0.039_28 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastFg(bg: string): string {
  const l = luminance(bg);
  const onWhite = (1 + 0.05) / (l + 0.05);
  const onBlack = (l + 0.05) / (0 + 0.05);
  return onWhite >= onBlack ? "#ffffff" : "#000000";
}

function mixHex(
  hex: string,
  toward: "#ffffff" | "#000000",
  amount: number
): string {
  const c = hex.replace("#", "");
  const t = toward.replace("#", "");
  const mix = (ch: string, th: string) =>
    Math.round(
      Number.parseInt(ch, 16) +
        (Number.parseInt(th, 16) - Number.parseInt(ch, 16)) * amount
    );
  const r = mix(c.slice(0, 2), t.slice(0, 2));
  const g = mix(c.slice(2, 4), t.slice(2, 4));
  const b = mix(c.slice(4, 6), t.slice(4, 6));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function applyFavicon(primary: string, secondary: string, primaryFg: string) {
  const pennant = `<polygon points="7,5 29,16 7,27" fill="${secondary}"/>
    <rect x="7" y="5" width="3" height="22" fill="${primaryFg}"/>`;

  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="5" fill="${primary}"/>
    ${pennant}
  </svg>`;
  const touchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" fill="${primary}"/>
    ${pennant}
  </svg>`;

  function setLink(rel: string, svg: string) {
    const url = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    let link = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
    if (!link) {
      link = document.createElement("link");
      link.rel = rel;
      document.head.appendChild(link);
    }
    link.href = url;
  }

  setLink("icon", faviconSvg);
  setLink("apple-touch-icon", touchSvg);
}

export function applyTheme() {
  const root = document.documentElement;
  const { colors } = config.brand;

  root.style.setProperty("--brand-primary", colors.primary);
  const primaryFg = contrastFg(colors.primary);
  root.style.setProperty("--brand-primary-fg", primaryFg);
  root.style.setProperty(
    "--brand-primary-hover",
    mixHex(
      colors.primary,
      primaryFg === "#ffffff" ? "#ffffff" : "#000000",
      0.12
    )
  );

  root.style.setProperty("--brand-secondary", colors.secondary);
  root.style.setProperty("--brand-secondary-fg", contrastFg(colors.secondary));

  const pennantColor = colors.pennant || colors.secondary;
  root.style.setProperty("--brand-pennant", pennantColor);
  const pennantFg =
    colors.pennantFg ||
    (contrastRatio(colors.primary, pennantColor) >= 3
      ? colors.primary
      : contrastFg(pennantColor));
  root.style.setProperty("--brand-pennant-fg", pennantFg);

  const navbarColor = colors.navbar || colors.primary;
  root.style.setProperty("--brand-navbar", navbarColor);
  const navbarFg = contrastFg(navbarColor);
  root.style.setProperty("--brand-navbar-fg", navbarFg);
  root.style.setProperty(
    "--brand-navbar-hover",
    mixHex(navbarColor, navbarFg === "#ffffff" ? "#ffffff" : "#000000", 0.12)
  );

  const signupBg =
    contrastRatio(colors.secondary, navbarColor) >= 3
      ? colors.secondary
      : contrastFg(navbarColor);
  root.style.setProperty("--brand-signup-bg", signupBg);
  root.style.setProperty("--brand-signup-fg", contrastFg(signupBg));

  const heroLinkColor =
    contrastRatio(colors.secondary, "#000000") >= 4.5
      ? colors.secondary
      : "#ffffff";
  root.style.setProperty("--brand-hero-link", heroLinkColor);

  const searchBg =
    contrastRatio(colors.primary, "#ffffff") >= 4.5
      ? "#1e293b"
      : mixHex(colors.primary, "#000000", 0.85);
  root.style.setProperty("--brand-search-bg", searchBg);

  applyFavicon(colors.primary, colors.secondary, primaryFg);

  const heroUrl = config.brand.heroImage || "/hero-texture.jpg";
  let heroPreload = document.querySelector<HTMLLinkElement>(
    "link[data-hero-preload]"
  );
  if (!heroPreload) {
    heroPreload = document.createElement("link");
    heroPreload.rel = "preload";
    heroPreload.setAttribute("as", "image");
    heroPreload.setAttribute("data-hero-preload", "");
    document.head.appendChild(heroPreload);
  }
  heroPreload.href = heroUrl;

  const appTitle = config.school.shortName
    ? `RYL ${config.school.shortName}`
    : "RYL";
  for (const name of ["apple-mobile-web-app-title", "application-name"]) {
    let meta = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = appTitle;
  }
}
