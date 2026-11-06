import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { config } from "./src/config.js";

const titleReg = /<title>[^<]*<\/title>/u;

function lum(hex: string): number {
  const c = hex.replace("#", "");
  const r = Number.parseInt(c.slice(0, 2), 16) / 255;
  const g = Number.parseInt(c.slice(2, 4), 16) / 255;
  const b = Number.parseInt(c.slice(4, 6), 16) / 255;
  const lin = (v: number) =>
    v <= 0.039_28 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrastFg(hex: string): "#ffffff" | "#000000" {
  const l = lum(hex);
  return 1.05 / (l + 0.05) >= (l + 0.05) / 0.05 ? "#ffffff" : "#000000";
}
function cr(a: string, b: string): number {
  const la = lum(a),
    lb = lum(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  checkEnv(env);
  checkConfig();

  return {
    environments: {
      worker: { build: { sourcemap: true } },
    },
    plugins: [
      vue(),
      tailwindcss(),
      cloudflare({ viteEnvironment: { name: "worker" } }),
      ogTagsPlugin(),
      socialImagePlugin(),
    ],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
  };
});

function ogTagsPlugin(): Plugin {
  return {
    name: "og-tags",
    transformIndexHtml(html) {
      const { name: schoolName, shortName } = config.school;
      const { siteUrl } = config.legal;
      const title = shortName
        ? `Rate Your Landlord ${shortName}`
        : "Rate Your Landlord";
      const description = `Read and write reviews of landlords near ${schoolName}.`;
      const image = `${siteUrl}/og.png`;
      const tags = [
        `    <meta name="description" content="${description}">`,
        `    <meta property="og:type" content="website">`,
        `    <meta property="og:title" content="${title}">`,
        `    <meta property="og:description" content="${description}">`,
        `    <meta property="og:url" content="${siteUrl}">`,
        `    <meta property="og:image" content="${image}">`,
        `    <meta name="twitter:card" content="summary_large_image">`,
        `    <meta name="twitter:title" content="${title}">`,
        `    <meta name="twitter:description" content="${description}">`,
        `    <meta name="twitter:image" content="${image}">`,
      ].join("\n");
      return html
        .replace(titleReg, `<title>${title}</title>`)
        .replace("</head>", `${tags}\n  </head>`);
    },
  };
}

function socialImagePlugin(): Plugin {
  return {
    name: "social-image",
    async generateBundle() {
      if (
        (this as unknown as { environment?: { name: string } }).environment
          ?.name === "worker"
      ) {
        return;
      }
      const { colors } = config.brand;
      const { shortName } = config.school;
      const pennantColor = colors.pennant || colors.secondary;
      const primaryFg = contrastFg(colors.primary);
      const pennantFg =
        cr(colors.primary, pennantColor) >= 3
          ? colors.primary
          : contrastFg(pennantColor);
      const fontB64 = fs
        .readFileSync(
          "public/font/gt-america/GT-America-Condensed-Bold-Trial.otf"
        )
        .toString("base64");
      const fontAttrs = `font-family="'GT America Condensed','Helvetica Neue Condensed Bold','Arial Narrow',sans-serif" font-weight="700"`;
      const fontDef = `<defs><style>@font-face{font-family:'GT America Condensed';font-weight:700;src:url('data:font/otf;base64,${fontB64}') format('opentype');}</style></defs>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" ${fontAttrs}>
        ${fontDef}
        <rect width="1200" height="630" fill="${colors.primary}"/>
        <path d="M651,208 L1166,315 L651,422 Z" fill="${pennantColor}"/>
        <path d="M651,208 L671,212 L671,418 L651,422 Z" fill="${primaryFg}"/>
        <text x="60" y="293" font-size="116" fill="${primaryFg}">RATE YOUR</text>
        <text x="60" y="420" font-size="116" fill="${primaryFg}">LANDLORD</text>
        <text x="684" y="348" font-size="91" fill="${pennantFg}">${shortName}</text>
      </svg>`;
      const { Resvg } = await import("@resvg/resvg-js");
      const png = new Resvg(svg, {
        font: {
          fontFiles: [
            "public/font/gt-america/GT-America-Condensed-Bold-Trial.otf",
          ],
          loadSystemFonts: false,
          defaultFontFamily: "GT America Condensed",
        },
      })
        .render()
        .asPng();
      this.emitFile({
        type: "asset",
        fileName: "og.png",
        source: Buffer.from(png),
      });
    },
  };
}

function checkConfig() {
  const issues: string[] = [];
  if (config.school.name === "Your University") {
    issues.push("  school.name  (full university name)");
  }
  if (config.school.shortName === "YSU") {
    issues.push("  school.shortName  (university abbreviation)");
  }
  if (config.school.location === "Your City, ST") {
    issues.push("  school.location  (city and state)");
  }
  if (config.school.studentEmailDomains.includes("youruniversity.edu")) {
    issues.push("  school.studentEmailDomains  (your school's email domain)");
  }
  if (config.contact.email === "admin@yoursite.com") {
    issues.push("  contact.email  (your contact email)");
  }
  if (config.legal.siteUrl === "https://yoursite.com") {
    issues.push("  legal.siteUrl  (your deployed site URL)");
  }
  if (config.legal.jurisdiction === "Your State") {
    issues.push("  legal.jurisdiction  (your state or jurisdiction)");
  }
  if (
    config.resources.some((r) =>
      r.links.some((l) => l.url === "https://example.org")
    )
  ) {
    issues.push(
      "  resources  (replace the example link with real local resources)"
    );
  }
  if (
    config.features.addressAutocomplete &&
    config.school.coordinates.latitude === 0 &&
    config.school.coordinates.longitude === 0
  ) {
    issues.push(
      "  school.coordinates  (latitude/longitude for address autocomplete)"
    );
  }

  if (issues.length) {
    console.warn(
      "\n\x1b[33m⚠ src/config.ts still has placeholder values, update before deploying:\x1b[0m\n" +
        issues.join("\n") +
        "\n"
    );
  }
}

function checkEnv(env: Record<string, string>) {
  let configSource = "";
  try {
    configSource = fs.readFileSync("./src/config.ts", "utf-8");
  } catch {
    return;
  }

  const always = [
    { key: "VITE_SUPABASE_URL", label: "Supabase project URL" },
    { key: "VITE_SUPABASE_PUBLISHABLE_KEY", label: "Supabase publishable key" },
  ];

  const featureGated = [
    {
      feature: "turnstile",
      key: "VITE_TURNSTILE_SITE_KEY",
      label: "Cloudflare Turnstile site key",
    },
    {
      feature: "addressAutocomplete",
      key: "VITE_MAPBOX_TOKEN",
      label: "Mapbox address autocomplete",
    },
    {
      feature: "contactForm",
      key: "VITE_FORMSPREE_URL",
      label: "Formspree contact form endpoint",
    },
  ];

  const missing: string[] = [];
  for (const { key, label } of always) {
    if (!env[key]) {
      missing.push(`  ${key}  (${label})`);
    }
  }
  for (const { feature, key, label } of featureGated) {
    if (
      new RegExp(`${feature}:\\s*true`, "u").test(configSource) &&
      !env[key]
    ) {
      missing.push(`  ${key}  (${label})`);
    }
  }

  if (missing.length) {
    console.warn(
      "\n\x1b[33m⚠ Missing .env keys, copy .env.example to .env and fill in:\x1b[0m\n" +
        missing.join("\n") +
        "\n"
    );
  }
}
