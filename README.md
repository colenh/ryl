# Rate Your Landlord

A student-run landlord review site you can deploy for any university. Students register, submit reviews, and browse ratings.

Built with Vue 3, Vite, Supabase, and Cloudflare Workers. All customization lives in two files: `src/config.ts` and `.env` (plus `.dev.vars` for Worker secrets).

---

## Prerequisites

- [Bun](https://bun.sh) (recommended), or Node.js 20+ with npm, pnpm, or Yarn. If you use Node, replace `bun` with your package manager and `bunx` with `npx` throughout this guide.
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) (Cloudflare's CLI): `bun install -g wrangler`
- A [Supabase](https://supabase.com) account (free tier works)
- A [Cloudflare](https://cloudflare.com) account (free tier works)
- A [Mapbox](https://mapbox.com) account for address autocomplete (optional, free tier works)
- A [Formspree](https://formspree.io) account for contact form (optional, free tier works)

---

## Local dev

```bash
bun install
cp .env.example .env
bun run dev
```

The site opens at `http://localhost:5173`.

If you have not filled in `.env` yet, that is fine. The app detects missing Supabase credentials and runs in **mock mode** automatically, using built-in fake data so you can preview the UI without any backend.

To test Worker logic locally (Turnstile verification), also copy `.dev.vars.example` to `.dev.vars` and fill in your secret key, then run `bun run preview` instead of `bun run dev`. This builds the app and runs it inside the actual Cloudflare Workers runtime.

---

## Supabase setup

### 1. Create a project

Go to [supabase.com](https://supabase.com), create a new project, and wait for it to provision.

### 2. Run the database migration

Open the **SQL Editor** in your Supabase dashboard, paste the entire contents of `supabase/migrations/001_initial.sql`, and click **Run**. This creates all tables, views, triggers, and security rules.

### 3. Set up transactional email (Resend)

By default Supabase sends auth emails (verification, password reset) through a shared server with tight rate limits. For production you need your own SMTP provider. [Resend](https://resend.com) is free up to 3,000 emails/month and takes five minutes to set up.

**Step 1: Create a Resend account and get an API key**

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys > Create API Key**, name it anything, and copy the key, you will only see it once

**Step 2: Add and verify a sending domain**

1. In Resend go to **Domains > Add Domain** and enter your domain (e.g. `yoursite.com`)
2. Resend shows you a set of DNS records (MX, TXT, DKIM). Add them in your DNS provider
3. Click **Verify** once the records have propagated, this usually takes a few minutes

**Step 3: Connect Resend to Supabase**

In your Supabase dashboard go to **Project Settings > Authentication > SMTP Settings** and fill in:

| Field              | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| Enable Custom SMTP | on                                                                   |
| Sender name        | e.g. `Rate Your Landlord - YU`                                       |
| Sender email       | e.g. `noreply@yoursite.com` (must match your verified Resend domain) |
| Host               | `smtp.resend.com`                                                    |
| Port               | `465`                                                                |
| Username           | `resend`                                                             |
| Password           | your Resend API key                                                  |

Click **Save**. Supabase will now route all auth emails through Resend.

### 4. Configure auth URLs

In your Supabase dashboard go to **Authentication > URL Configuration** and set:

- **Site URL**: your production domain, e.g. `https://yoursite.com`
- **Redirect URLs**: add each URL on its own line:
  - `http://localhost:5173/**` local dev
  - `https://yoursite.com/**` production

The Site URL is used as the base for auth redirect links in emails. If it is wrong, verification and password reset links will not work.

### 5. Get your API keys

Go to **Project Settings > API** and copy:

- **Project URL**, looks like `https://abcdefgh.supabase.co`
- **Publishable key**, labeled "publishable"

You will put these in `.env` next.

---

## Environment variables

Copy `.env.example` to `.env` and fill it in. Only the first two are always required. The rest depend on which features you enable in `config.ts`.

```
# Always required
VITE_SUPABASE_URL="https://your-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"

# Required if features.addressAutocomplete is true
VITE_MAPBOX_TOKEN="pk.your_token"

# Required if features.contactForm is true
VITE_FORMSPREE_URL="https://formspree.io/f/your-form-id"

# Required if features.turnstile is true
VITE_TURNSTILE_SITE_KEY="your-site-key"
```

Variables starting with `VITE_` are bundled into the browser build at build time.

**Worker secrets** (`TURNSTILE_SECRET_KEY`) never go in `.env`. They live in a separate file:

- **Local dev/preview**: copy `.dev.vars.example` to `.dev.vars` and fill it in. Wrangler reads this file automatically when running `bun run preview`.
- **Production**: set via `wrangler secret put TURNSTILE_SECRET_KEY` (see [Deploy](#deploy)).

---

## Configure your site

Open `src/config.ts`. This is the only non-env file you need to edit.

### School info

```ts
school: {
  name: "Your University",           // full name
  shortName: "YU",                   // abbreviation, shown in the navbar
  location: "Your City, ST",         // city and state
  studentEmailDomains: ["youruniversity.edu", "student.yu.edu"], // email domains for the Verified Student badge
  coordinates: { latitude: 0, longitude: 0 }, // city center for map search
  searchBounds: [0, 0, 0, 0], // bounding box [W, S, E, N] for address autocomplete
}
```

Find your coordinates at [latlong.net](https://www.latlong.net) and your bounding box at [boundingbox.klokantech.com](https://boundingbox.klokantech.com), select **CSV** from the format dropdown to get four comma-separated numbers in the right order (W, S, E, N).

### Brand colors

```ts
brand: {
  colors: {
    primary: "",           // buttons, links, main accent
    secondary: "",         // highlights, badges
    navbar: "",            // optional, defaults to primary
    pennant: "",           // optional pennant/triangle color, defaults to secondary
    pennantFg: "",         // optional text on the pennant, defaults to a readable contrast
  },
  heroImage: "",           // optional background image URL on the home page
}
```

Your school's brand colors are usually on its brand kit page or on Wikipedia. Run your primary color through [WebAIM's contrast checker](https://webaim.org/resources/contrastchecker/) to make sure it is readable on white.

### Brand assets

Once you have set your colors, `name`, and `shortName`, run the export script to generate SVG and PNG files for social profiles, favicons, and marketing:

```bash
bun run scripts/export-brand.ts
```

Files land in `brand-exports/`:

| File                                           | Use                                                                    |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| `favicon-32.png` / `favicon-512.png`           | Favicon reference                                                      |
| `favicon-32-text.png` / `favicon-512-text.png` | Same with school initials on the pennant                               |
| `social-512.png` / `social-512-text.png`       | Square profile image for Bluesky, Instagram, etc. (no rounded corners) |
| `pennant.png` / `pennant-text.png`             | Standalone pennant, transparent background                             |
| `logo-header.png`                              | Navbar logo on a filled background                                     |
| `logo-header-transparent.png`                  | Navbar logo, transparent background (for use on white)                 |
| `logo-homepage.png`                            | Full "Rate Your Landlord + pennant" lockup                             |

The script reads GT America Condensed Bold from `public/font/gt-america/GT-America-Condensed-Bold-Trial.otf`, if you have a different font, update the `fontFiles` path in the script.

### Contact

```ts
contact: {
  email: "admin@yoursite.com", // shown on the Contact and legal pages
}
```

### Legal

```ts
legal: {
  legalName: "Your Organization",       // your name or org, shown in legal docs
  siteUrl: "https://yoursite.com",      // your production URL
  jurisdiction: "Your State",           // state that governs your Terms and Privacy Policy
  lastUpdated: "November 2, 2026",      // date shown on legal pages
}
```

### Features

Set any of these to `false` to turn the feature off.

| Feature               | What it does                                         | Requires                                                                                    |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `addressAutocomplete` | Autocomplete on address fields                       | `VITE_MAPBOX_TOKEN`                                                                         |
| `collectRentAmount`   | Rent amount, bedrooms, bathrooms fields on reviews   | nothing                                                                                     |
| `contactForm`         | Contact form on the Contact page                     | `VITE_FORMSPREE_URL`                                                                        |
| `studentBadge`        | "Verified Student" badge on reviews                  | `studentEmailDomains` set                                                                   |
| `turnstile`           | Bot protection on login, register, and contact forms | `VITE_TURNSTILE_SITE_KEY` (`.env`) + `TURNSTILE_SECRET_KEY` (`.dev.vars` / Wrangler secret) |

### Resources page

The `/resources` page shows a list of links for tenants. Replace the default links with ones for your area. The format is:

```ts
resources: [
  {
    category: "Tenant Rights",
    links: [
      {
        title: "Your State Landlord-Tenant Law",
        url: "https://...",
        description: "One sentence about what this link is.",
      },
    ],
  },
];
```

### Social links

```ts
social: {
  instagram: "https://instagram.com/yourhandle", // leave empty to hide the icon
  bluesky:   "https://bsky.app/profile/yourhandle.bsky.social",
  twitter:   "https://x.com/yourhandle",
  tiktok:    "https://tiktok.com/@yourhandle",
}
```

Icons appear in the footer only when the URL is set. Leave any field as `""` to hide that icon.

### Review tags

`reviewTags` is the list of checkboxes on the review form. Edit freely: add, remove, or rename tags. Keep each one short (3-5 words).

---

## Make yourself an admin

After creating an account on the site, go to your Supabase dashboard, open **Table Editor > admins**, and insert a row with your user's UUID as `user_id`.

To find your UUID: **Authentication > Users**, find your email, copy the UUID.

Admins can edit and delete any landlord, delete any review, and access `/admin`.

---

## Optional feature setup

### Address autocomplete (Mapbox)

1. Sign up at [mapbox.com](https://mapbox.com)
2. Go to **Dashboard > Tokens > Create a token**
3. Name it anything, leave public scopes enabled (no secret scopes needed)
4. Add your production URL and `http://localhost:5173` to the allowed URLs
5. Copy the token into `VITE_MAPBOX_TOKEN`

Free tier is 100,000 requests per month, credit card required but not charged until exceeded.

### Contact form (Formspree)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form, copy the endpoint URL (looks like `https://formspree.io/f/abc12345`)
3. Paste it into `VITE_FORMSPREE_URL`

### Bot protection (Turnstile)

1. Log into [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Turnstile** and create a site
3. Copy the **Site Key** into `VITE_TURNSTILE_SITE_KEY`
4. Copy the **Secret Key** into `TURNSTILE_SECRET_KEY` (only used by the Worker, never in the browser)

For local testing you can use Cloudflare's always-pass test keys:

- Site key: `1x00000000000000000000AA`
- Secret key: `1x0000000000000000000000000000000AA`

---

## Deploy

The site deploys as a Cloudflare Worker that serves your static files and handles Turnstile verification server-side.

### Name your Worker

Open `wrangler.jsonc` and change the `name` field to something specific to your school. This is how it shows up in your Cloudflare dashboard.

```jsonc
"name": "ryl-ohio-state" // or whatever you like
```

### First deploy

```bash
wrangler login
wrangler secret put TURNSTILE_SECRET_KEY
# paste your secret key when prompted
```

Then deploy:

```bash
bun run deploy
```

This runs `vue-tsc`, `vite build`, and `wrangler deploy --config dist/wrangler.json` in one shot. The build outputs a `dist/wrangler.json` that points to the compiled assets and Worker bundle; wrangler deploys from that.

### Subsequent deploys

Same command. Wrangler will update the Worker in place.

### Deploy from GitHub Actions

The included workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) auto-deploys on every push to `main` and can also be triggered manually from **GitHub > Actions > Deploy > Run workflow**. If you don't want auto-deploys, remove the `push` trigger from the workflow file or delete it entirely.

**Step 1: Create a Cloudflare API token**

Go to [dash.cloudflare.com](https://dash.cloudflare.com) > **My Profile > API Tokens > Create Token**. Use the **"Edit Cloudflare Workers"** template. Copy the token.

**Step 2: Find your Cloudflare Account ID**

It is shown in the right sidebar of the Cloudflare dashboard, or on the **Workers & Pages** overview page.

**Step 3: Add GitHub secrets**

Go to your GitHub repo > **Settings > Secrets and variables > Actions > New repository secret** and add all of these:

| Secret name                     | Value                               |
| ------------------------------- | ----------------------------------- |
| `CLOUDFLARE_API_TOKEN`          | API token from step 1               |
| `CLOUDFLARE_ACCOUNT_ID`         | Account ID from step 2              |
| `VITE_SUPABASE_URL`             | Your Supabase project URL           |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon key              |
| `VITE_MAPBOX_TOKEN`             | Only if `addressAutocomplete` is on |
| `VITE_FORMSPREE_URL`            | Only if `contactForm` is on         |
| `VITE_TURNSTILE_SITE_KEY`       | Only if `turnstile` is on           |
| `TURNSTILE_SECRET_KEY`          | Only if `turnstile` is on           |

The `VITE_` variables are baked into the browser bundle at build time, so they must be present as GitHub secrets even though they are not real secrets in the security sense. `TURNSTILE_SECRET_KEY` is a true secret, it is injected into the Worker by the `wrangler-action` and never ends up in the browser bundle.

**Step 4: Add the workflow file**

The workflow file [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) is already included. It uses Bun; swap in `actions/setup-node` if you prefer Node in CI.

### Custom domain

In the Cloudflare dashboard, go to **Workers & Pages**, open your Worker, and add a custom domain under **Settings > Domains & Routes**.

### Preview locally with the Worker

To test the Worker logic (Turnstile verification) locally before deploying, make sure `.dev.vars` is filled in, then:

```bash
bun run preview
```

This builds the app and runs it inside the actual Cloudflare Workers runtime via Wrangler, so it behaves identically to production.

---

## Project structure (quick map)

```
src/config.ts        All site customization
src/pages/           One file per route
src/stores/          Pinia stores (auth, landlords, reviews)
src/lib/             Supabase client, mock data, schemas
worker/index.ts      Cloudflare Worker (Turnstile verification; static serving and SPA routing handled by the platform)
supabase/migrations/ Database schema
```

---

## Before you go live

Go through this once before you share the URL with anyone.

- [ ] `src/config.ts`: school name, short name, location, coordinates, search bounds
- [ ] `src/config.ts`: primary and secondary brand colors
- [ ] `src/config.ts`: contact email, legal name, site URL, jurisdiction
- [ ] `src/config.ts`: resources links replaced with ones for your area
- [ ] `src/config.ts`: review tags edited to fit your school
- [ ] `src/config.ts`: social links filled in (or left empty to hide icons)
- [ ] `.env`: Supabase URL and publishable key filled in
- [ ] Supabase: SQL migration run (`supabase/migrations/001_initial.sql`)
- [ ] Supabase: Site URL and redirect URLs set (Authentication > URL Configuration)
- [ ] Supabase: Custom SMTP configured with Resend (Project Settings > Authentication > SMTP)
- [ ] Resend: sending domain verified
- [ ] `wrangler.jsonc`: `name` changed from `rateyourlandlord` to your own
- [ ] `package.json`: `name` changed from `rateyourlandlord` to your own
- [ ] Admin account created (register on the site, then add your UUID to the `admins` table)

---

## FAQ

**Do students need to verify their email?**
Yes. Supabase sends a verification link. Make sure your Site URL is set correctly in the Supabase dashboard or links will not work.

**How do I reset someone's password?**
You cannot do it directly. The user goes to `/reset-password` and Supabase sends them a link.

**Can I run this without Cloudflare?**
Yes, for the frontend only. Set `features.turnstile` to `false` in `config.ts`, run `bun run build`, and deploy `dist/client/` to any static host. Without the Worker there is no Turnstile server-side verification, so Turnstile must be disabled or the forms will reject all submissions.

**The app shows fake data and nothing saves.**
You are in mock mode. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are both set in `.env` and that you restarted the dev server after editing it.
