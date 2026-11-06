<script lang="ts" setup>
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import BackToTop from "@/components/ui/BackToTop.vue";
  import { config } from "@/config";

  const { legalName, siteUrl, lastUpdated } = config.legal;
  const subprocessors = [
    {
      location: "United States",
      name: "Cloudflare",
      purpose: "Hosting, content delivery, and DDoS protection",
      url: "https://www.cloudflare.com/privacypolicy/",
    },
    {
      location: "United States",
      name: "Resend",
      purpose: "Delivers transactional email.",
      url: "https://resend.com/legal/privacy-policy",
    },
    {
      location: "Singapore",
      name: "Supabase",
      purpose: "Database and authentication",
      url: "https://supabase.com/privacy",
    },
    ...(config.features.addressAutocomplete
      ? [
          {
            location: "United States",
            name: "Mapbox",
            purpose: "Address autocomplete",
            url: "https://www.mapbox.com/legal/privacy",
          },
        ]
      : []),
    ...(config.features.contactForm
      ? [
          {
            location: "United States",
            name: "Formspree",
            purpose: "Contact form submission",
            url: "https://formspree.io/legal/privacy-policy",
          },
        ]
      : []),
  ];
  const { email } = config.contact;
  const { name: schoolName } = config.school;
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-3xl flex-1 px-6">
      <section class="border-border border-b pt-14 pb-10">
        <h1 class="font-display text-text text-4xl font-medium tracking-tight">
          Privacy Policy
        </h1>
        <p class="text-text-faint mt-2 font-mono text-xs">
          Last Updated: {{ lastUpdated }}
        </p>
        <p class="text-text-muted mt-8 text-sm leading-relaxed">
          This Privacy Policy describes how
          <span class="text-text font-medium">{{ legalName }}</span>
          ("we," "us," or "our") collects, uses, and shares information about
          you when you use
          <a
            class="text-primary underline underline-offset-2"
            :href="siteUrl"
            >{{
              siteUrl
            }}</a
          >
          (the "Site"), a platform where {{ schoolName }} students and community
          members can publicly review landlords and rental properties.
        </p>
        <p class="text-text-muted mt-3 text-sm leading-relaxed">
          By using the Site you agree to this Policy. If you do not agree,
          please do not use the Site.
        </p>
      </section>

      <div
        class="text-text-muted flex flex-col gap-10 py-10 text-sm leading-relaxed"
      >
        <!-- 1 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            1. Information We Collect
          </h2>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            A. Information You Provide
          </h3>
          <ul class="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong class="text-text">Account registration.</strong>
              When you create an account we collect your email address and a
              hashed password. We do not store your password in plain text.
            </li>
            <li>
              <strong class="text-text">Reviews.</strong>
              When you submit a review we collect your rating, written comments,
              selected tags, and (if enabled) monthly rent amount. Reviews are
              associated with your account.
            </li>
            <li>
              <strong class="text-text">Landlord listings.</strong>
              When you add a landlord you provide their name and property
              addresses. This information is public.
            </li>
            <li>
              <strong class="text-text">Contact form.</strong>
              When you contact us we collect your email address and message.
            </li>
          </ul>

          <h3 class="text-text mt-5 mb-2 font-semibold">
            B. Information Collected Automatically
          </h3>
          <ul class="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong class="text-text">Log data.</strong>
              Our hosting provider automatically collects standard server logs
              including your IP address, browser type, referring URL, and pages
              visited.
            </li>
            <li>
              <strong class="text-text">Cookies.</strong>
              We use session cookies to keep you signed in. We do not use
              advertising or tracking cookies.
            </li>
          </ul>
        </section>

        <!-- 2 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            2. How We Use Your Information
          </h2>
          <ul class="flex list-disc flex-col gap-2 pl-5">
            <li>To create and manage your account.</li>
            <li>
              To display your reviews and landlord listings publicly on the
              Site.
            </li>
            <li>
              To verify your student status and display a Verified Student badge
              on your reviews when your email matches the
              {{ schoolName }} student email domain.
            </li>
            <li>
              To respond to your messages submitted through the contact form.
            </li>
            <li>To detect and prevent fraud, abuse, and security incidents.</li>
            <li>To comply with our legal obligations.</li>
          </ul>
        </section>

        <!-- 3 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            3. Public Information
          </h2>
          <p>
            Reviews, ratings, tags, and landlord listings you submit are
            <strong class="text-text">publicly visible</strong>
            to all visitors of the Site, including people who are not signed in.
            Do not include personal information in a review that you would not
            want to be public. Your email address and account details are never
            displayed publicly.
          </p>
        </section>

        <!-- 4 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            4. How We Share Your Information
          </h2>
          <p>
            We do not sell your personal information. We share information only
            in the following circumstances:
          </p>
          <ul class="mt-3 flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong class="text-text">Subprocessors.</strong>
              We use third-party services to operate the Site. See Section 5 for
              the full list.
            </li>
            <li>
              <strong class="text-text">Legal requirements.</strong>
              We may disclose information if required by law, court order, or
              government request, or to protect the rights, property, or safety
              of us, our users, or others.
            </li>
            <li>
              <strong class="text-text">Business transfers.</strong>
              If we transfer or merge the Site, your information may be
              transferred as part of that transaction.
            </li>
          </ul>
        </section>

        <!-- 5 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            5. Subprocessors
          </h2>
          <p>
            The following third-party services process data on our behalf. Each
            has its own privacy policy governing their use of your data.
          </p>
          <div
            class="border-border mt-4 overflow-hidden rounded-(--radius) border"
          >
            <table class="w-full text-xs">
              <thead>
                <tr class="bg-surface border-border border-b">
                  <th class="text-text px-4 py-2.5 text-left font-semibold">
                    Service
                  </th>
                  <th class="text-text px-4 py-2.5 text-left font-semibold">
                    Purpose
                  </th>
                  <th class="text-text px-4 py-2.5 text-left font-semibold">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(sp, i) in subprocessors"
                  :key="sp.name"
                  :class="
                    i < subprocessors.length - 1 ? 'border-b border-border' : ''
                  "
                >
                  <td class="px-4 py-2.5">
                    <a
                      class="text-primary underline underline-offset-2"
                      rel="noopener"
                      target="_blank"
                      v-if="sp.url"
                      :href="sp.url"
                      >{{
                        sp.name
                      }}</a
                    >
                    <span v-else>{{ sp.name }}</span>
                  </td>
                  <td class="text-text-muted px-4 py-2.5">{{ sp.purpose }}</td>
                  <td class="text-text-muted px-4 py-2.5">{{ sp.location }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 6 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            6. Data Retention
          </h2>
          <p>
            We retain your account information and reviews for as long as your
            account is active. If you delete your account, we will delete your
            personal information within a reasonable time, except where
            retention is required by law or necessary to protect legitimate
            interests. Public review content may be retained in an anonymized or
            attributed form at our discretion.
          </p>
        </section>

        <!-- 7 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            7. Your Rights and Choices
          </h2>
          <ul class="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong class="text-text">Access and correction.</strong>
              You may request access to or correction of your personal
              information by contacting us.
            </li>
            <li>
              <strong class="text-text">Deletion.</strong>
              You may request deletion of your account and associated personal
              information by contacting us. Note that publicly submitted reviews
              may remain visible.
            </li>
            <li>
              <strong class="text-text">Cookies.</strong>
              You can disable cookies in your browser settings; however, this
              will prevent you from staying signed in.
            </li>
            <li>
              <strong class="text-text">Do Not Track.</strong>
              We do not respond to Do Not Track signals.
            </li>
          </ul>
        </section>

        <!-- 8 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            8. Security
          </h2>
          <p>
            We take reasonable technical and organizational measures to protect
            your information. Passwords are stored using industry-standard
            hashing. However, no method of transmission or storage is completely
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <!-- 9 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            9. Children's Privacy
          </h2>
          <p>
            The Site is not directed at children under 13. We do not knowingly
            collect personal information from children. If you believe a child
            has provided us with information, please contact us so we can delete
            it.
          </p>
        </section>

        <!-- 10 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            10. Third-Party Links
          </h2>
          <p>
            The Site may link to external websites. We are not responsible for
            the privacy practices of those sites and encourage you to read their
            policies.
          </p>
        </section>

        <!-- 11 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            11. Changes to This Policy
          </h2>
          <p>
            We may update this Policy from time to time. We will post changes on
            this page and update the "Last Updated" date. Continued use of the
            Site after changes are posted constitutes your acceptance of the
            updated Policy.
          </p>
        </section>

        <!-- 12 -->
        <section class="pb-4">
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            12. Contact Us
          </h2>
          <p>
            If you have questions about this Policy or wish to exercise your
            rights, please contact us at
            <a
              class="text-primary underline underline-offset-2"
              :href="`mailto:${email}`"
              >{{
                email
              }}</a
            >.
          </p>
        </section>
      </div>
    </main>
    <AppFooter />
    <BackToTop />
  </div>
</template>
