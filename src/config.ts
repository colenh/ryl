/**
 * Rate Your Landlord: instance configuration
 *
 * Non-technical deployers: this file and your .env are the only two things you need to edit.
 * Secrets (API keys, database URLs) go in .env only. Never here.
 */

export const config = {
  brand: {
    /**
     * Colors, all hex strings. These drive the entire UI.
     * The primary color should have enough contrast on white (#fff).
     * Use a contrast checker: https://webaim.org/resources/contrastchecker/
     * Usually, these can be found on your schools brand kit or Wikipedia. (search [school] colors)
     */
    colors: {
      /** Optional: navbar background color. Defaults to primary. */
      navbar: "",
      /**
       * Optional: pennant (triangle) fill color. Defaults to secondary.
       * If primary and triangle fill color are same, pennant flag will not be visible on navbar.
       */
      pennant: "",
      /** Optional: text/icon color drawn on the pennant. Defaults to primary (falls back to black/white if primary doesn't contrast). */
      pennantFg: "",
      /** Primary action color, buttons, links. Replace with your school's color. */
      primary: "#1d4ed8",
      /** Secondary accent color, used for highlights and badges. Replace with your school's color. */
      secondary: "#f59e0b",
    },
    /** URL to a hero background image. Leave as '' to use the default texture. A great source for free images is https://commons.wikimedia.org/ */
    heroImage: "",
  },
  contact: {
    /** Contact email shown on the contact and legal pages */
    email: "admin@yoursite.com",
  },
  features: {
    /** Address autocomplete on landlord/review address fields. Requires VITE_MAPBOX_TOKEN in .env */
    addressAutocomplete: true,
    /** Collect monthly rent amount in reviews */
    collectRentAmount: true,
    /** Show a contact form on the Contact page. If false, only the email address is shown. */
    contactForm: true,
    /** Show "Verified Student" badge on reviews from the student email domain */
    studentBadge: true,
    /** Add Cloudflare Turnstile bot-protection to login, register, contact, and reset-password forms. Requires VITE_TURNSTILE_SITE_KEY in .env */
    turnstile: true,
  },
  legal: {
    /** State or jurisdiction governing these legal documents */
    jurisdiction: "Your State",
    /** Date shown on Privacy Policy and Terms of Service */
    lastUpdated: "November 2, 2026",
    /** Your name or organization name, typically "Rate Your Landlord [Your University]", "Jane Smith", or a company name */
    legalName: "Rate Your Landlord",
    /** Public site URL, e.g. "https://example.com" */
    siteUrl: "https://yoursite.com",
  },
  /**
   * Shown on the /resources page.
   * Replace these with links relevant to your state and city.
   * Add as many categories and links as you need.
   */
  resources: [
    {
      category: "Tenant Rights and Awareness",
      links: [
        {
          description: "One sentence-long description.",
          title: "Title",
          url: "https://example.org",
        },
      ],
    },
    {
      category: "Legal Aid",
      links: [
        {
          description:
            "Find a HUD-approved housing counselor near you for free or low-cost advice on renting and tenant rights.",
          title: "HUD-Approved Housing Counselors",
          url: "https://www.consumerfinance.gov/find-a-housing-counselor/",
        },
      ],
    },
  ],
  /**
   * Predefined tags reviewers can select. Edit freely: add, remove, rename.
   * Keep each tag short (3-5 words). They appear as checkboxes on the review form.
   */
  reviewTags: [
    "Fast repairs",
    "Slow repairs",
    "Good communication",
    "Hard to reach",
    "Clean unit",
    "Mold / maintenance issues",
    "Rodent infestations",
    "Fair rent",
    "Overpriced",
    "Junk fees",
    "Respectful of privacy",
    "Frequent unannounced entry",
    "Quick deposit refund",
    "Withheld deposit",
    "Lease issues",
    "Lawyer up!",
    "Pet friendly",
    "Close to campus",
    "Far from campus",
  ],
  social: {
    /** Bluesky profile URL, e.g. "https://bsky.app/profile/yourhandle.bsky.social". Leave empty to hide the icon. */
    bluesky: "",
    /** Instagram profile URL, e.g. "https://instagram.com/yourhandle". Leave empty to hide the icon. */
    instagram: "",
    /** TikTok profile URL, e.g. "https://tiktok.com/@yourhandle". Leave empty to hide the icon. */
    tiktok: "",
    /** Twitter/X profile URL, e.g. "https://x.com/yourhandle". Leave empty to hide the icon. */
    twitter: "",
  },
  school: {
    /**
     * Latitude/longitude of your city center. Used to bias address autocomplete results.
     * Find yours at https://www.latlong.net
     */
    coordinates: { latitude: 0, longitude: 0 },
    /**
     * Bounding box [west, south, east, north] that restricts autocomplete results to your area.
     * Results outside this box are excluded. Find yours at https://boundingbox.klokantech.com
     */
    searchBounds: [0, 0, 0, 0] as [number, number, number, number],
    /** City and state, e.g. "Your City, ST" */
    location: "Your City, ST",
    /** Full university name, e.g. "Your University" */
    name: "Your University",
    /** Short name, e.g. "YU" */
    shortName: "YSU",
    /** Email domains (everything after the @) that qualify for the Verified Student badge. Add multiple if your school has several. */
    studentEmailDomains: ["youruniversity.edu"],
  },
};
