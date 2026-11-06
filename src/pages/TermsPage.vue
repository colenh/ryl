<script lang="ts" setup>
  import AppFooter from "@/components/layout/AppFooter.vue";
  import AppHeader from "@/components/layout/AppHeader.vue";
  import BackToTop from "@/components/ui/BackToTop.vue";
  import { config } from "@/config";

  const { legalName, siteUrl, lastUpdated, jurisdiction } = config.legal;
  const { email } = config.contact;
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <main class="mx-auto w-full max-w-3xl flex-1 px-6">
      <section class="border-border border-b pt-14 pb-10">
        <h1 class="font-display text-text text-4xl font-medium tracking-tight">
          Terms of Service
        </h1>
        <p class="text-text-faint mt-2 font-mono text-xs">
          Last Updated: {{ lastUpdated }}
        </p>
        <p class="text-text-muted mt-8 text-sm leading-relaxed font-semibold">
          PLEASE READ THESE TERMS CAREFULLY BEFORE USING THIS SITE. IF YOU DO
          NOT AGREE, DO NOT ACCESS OR USE THE SITE.
        </p>
        <p class="text-text-muted mt-4 text-sm leading-relaxed">
          These Terms of Service ("Terms") constitute an agreement between you
          and <span class="text-text font-medium">{{ legalName }}</span> ("we,"
          "us," or "our"). This website at
          <a
            class="text-primary underline underline-offset-2"
            :href="siteUrl"
            >{{
              siteUrl
            }}</a
          >
          (the "Site") and any services provided through it (the "Services") are
          provided to you on condition that you accept these Terms. By accessing
          or using the Services, you agree to be bound by these Terms.
        </p>
        <p class="text-text-muted mt-3 text-sm leading-relaxed">
          We reserve the right to change these Terms, the Services, or any
          features at any time. Changes take effect immediately upon posting.
          Please review this page periodically.
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
            1. Dispute Resolution
          </h2>
          <p class="text-text mb-3 text-xs font-semibold">
            PLEASE READ THIS SECTION CAREFULLY. IT LIMITS HOW YOU AND
            {{ legalName.toUpperCase() }} CAN SEEK RELIEF FROM EACH OTHER AND
            REQUIRES ALL DISPUTES TO BE BROUGHT ON AN INDIVIDUAL BASIS ONLY.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            A. Governing Law and Venue
          </h3>
          <p>
            These Terms, and any disputes arising from them, will be governed by
            the laws of {{ jurisdiction }}, without regard to conflicts of law
            principles. You agree to the exclusive jurisdiction of the courts
            located in {{ jurisdiction }} for purposes of litigating any
            dispute.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">B. Disputes Defined</h3>
          <p>
            "Disputes" means any disputes, claims, actions, or controversies
            between you and {{ legalName }} arising out of or relating to these
            Terms or the Services, whether based in contract, tort, statute, or
            any other legal basis.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            C. Informal Resolution
          </h3>
          <p>
            Before initiating any legal proceeding, you and {{ legalName }} must
            first attempt to resolve the dispute informally for at least sixty
            (60) days by sending written notice to the other party. Notices to
            us must be sent to
            <a
              class="text-primary underline underline-offset-2"
              :href="`mailto:${email}`"
              >{{
                email
              }}</a
            >
            with the subject "Notice of Dispute" and must describe the nature of
            the dispute, the relief requested, and a signed statement verifying
            the accuracy of the notice.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            D. Class Action Waiver
          </h3>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, NO DISPUTE SHALL BE JOINED
            TO ANY OTHER DISPUTE. NO CLASS ACTION OR REPRESENTATIVE PROCEEDINGS
            ARE PERMITTED. ANY RELIEF MAY BE AWARDED ONLY INDIVIDUALLY.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            E. One-Year Limitation
          </h3>
          <p>
            You must send notice of or commence any claim within one (1) year of
            when the dispute first arose. Claims not brought within that time
            are permanently barred.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">F. Severability</h3>
          <p>
            If any part of this Section 1 is found unenforceable, that part will
            be severed and the remainder of these Terms will remain in effect.
          </p>
        </section>

        <!-- 2 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            2. Privacy Policy
          </h2>
          <p>
            Your use of the Services is also governed by our
            <a class="text-primary underline underline-offset-2" href="/privacy"
              >Privacy Policy</a
            >, which is incorporated into these Terms by reference. By using the
            Services, you consent to the collection and use of information as
            described there.
          </p>
        </section>

        <!-- 3 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            3. Use of This Site
          </h2>
          <p>
            If you access this Site from outside of the United States, you do so
            at your own risk and are responsible for compliance with applicable
            local laws. The Services may not be available in all locations.
          </p>
        </section>

        <!-- 4 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            4. Eligibility
          </h2>
          <p>
            You represent and warrant that you: (a) are above the legal age of
            majority in your jurisdiction; (b) have not previously been
            suspended or removed from the Services; and (c) have full authority
            to enter into these Terms. We may verify your student email address
            for eligibility purposes but do not verify the truth or accuracy of
            user-submitted content.
          </p>
        </section>

        <!-- 5 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            5. Your Account
          </h2>
          <p>
            To access certain features you may need to create an account. You
            agree to provide accurate, current, and complete information and to
            keep it updated. You are responsible for all activity on your
            account and for keeping your password confidential. You must not
            share your account with others or create multiple accounts to post
            multiple reviews.
          </p>
          <p class="mt-3">
            We reserve the right to suspend or terminate any account at our sole
            discretion, including for violation of these Terms.
          </p>
        </section>

        <!-- 6 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            6. Our Materials
          </h2>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            A. Intellectual Property
          </h3>
          <p>
            The Services and all content, software, graphics, logos, and other
            materials on the Site (collectively, "Materials") are owned by
            {{ legalName }} or third parties. All rights are reserved. Materials
            are protected by copyright, trademark, and other intellectual
            property laws.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">B. Limited License</h3>
          <p>
            We grant you a non-exclusive, non-transferable, non-sublicensable
            license to access and use the Materials for your personal,
            non-commercial use only. You may not reproduce, distribute, modify,
            create derivative works from, or commercially exploit any Materials
            without our prior written consent. Materials may not be submitted to
            or processed by any artificial intelligence or automated processing
            system.
          </p>
        </section>

        <!-- 7 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            7. User Content
          </h2>

          <h3 class="text-text mt-4 mb-2 font-semibold">A. License to Us</h3>
          <p>
            By submitting reviews, landlord listings, comments, or other content
            ("User Content") to the Services, you grant {{ legalName }} a
            royalty-free, perpetual, worldwide, irrevocable, non-exclusive
            license to use, publish, reproduce, modify, adapt, distribute, and
            otherwise exploit such User Content in any form or medium, for the
            full term of any applicable copyright.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            B. Public Visibility
          </h3>
          <p>
            User Content you submit is publicly visible to all visitors of the
            Site. Do not include private information you would not want publicly
            shared. You are solely responsible for the content you submit.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">C. Non-Confidential</h3>
          <p>
            User Content is non-confidential. We are under no obligation to
            treat it as proprietary and may delete, edit, or decline to post any
            User Content at our sole discretion.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">D. Disclaimer</h3>
          <p>
            We do not pre-screen User Content and make no representations
            regarding its accuracy. We do not verify the truth of any review or
            landlord listing submitted by users.
          </p>
        </section>

        <!-- 8 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            8. Acceptable Use
          </h2>

          <h3 class="text-text mt-4 mb-2 font-semibold">A. General Conduct</h3>
          <p class="mb-2">
            When using the Services you agree that you will not:
          </p>
          <ul class="flex list-disc flex-col gap-1.5 pl-5">
            <li>
              Impersonate another person or misrepresent your identity or
              affiliation.
            </li>
            <li>Submit knowingly false statements or fabricated reviews.</li>
            <li>
              Identify landlords by nicknames or unrelated personal details
              rather than the name on your lease or official county property
              records.
            </li>
            <li>
              Create multiple accounts to post multiple reviews of the same
              landlord.
            </li>
            <li>Promote or facilitate illegal activities.</li>
            <li>
              Violate the privacy, copyright, or other rights of any third
              party.
            </li>
            <li>Attempt to identify anonymous reviewers.</li>
            <li>
              Scrape, mine, or otherwise collect data from the Services through
              automated means without our written permission.
            </li>
            <li>
              Reverse engineer, decompile, or interfere with the functionality
              of the Services.
            </li>
            <li>Introduce malware, viruses, or other harmful code.</li>
            <li>
              Use the Services for commercial advertising or solicitation
              without our prior written consent.
            </li>
          </ul>

          <h3 class="text-text mt-5 mb-2 font-semibold">
            B. Content Guidelines
          </h3>
          <p class="mb-2">User Content must not:</p>
          <ul class="flex list-disc flex-col gap-1.5 pl-5">
            <li>
              Be pornographic, sexually explicit, or contain graphic violence.
            </li>
            <li>
              Be harassing, threatening, abusive, racist, obscene, or constitute
              hate speech.
            </li>
            <li>
              Infringe the intellectual property or privacy rights of any third
              party.
            </li>
            <li>
              Contain private information about any third party without their
              consent.
            </li>
            <li>Contain materially false information.</li>
          </ul>

          <h3 class="text-text mt-5 mb-2 font-semibold">
            C. Removal of Content
          </h3>
          <p>
            We reserve the right, without obligation, to remove any User Content
            at our sole discretion that violates these Terms, is likely to harm
            our reputation, or poses risk of harm to any person. We may also
            deactivate your account for any reason.
          </p>
        </section>

        <!-- 9 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            9. Intellectual Property Infringement (DMCA)
          </h2>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            A. Notice of Infringement
          </h3>
          <p class="mb-2">
            If you believe your copyrighted or trademarked work appears on the
            Site without authorization, please send a notice to
            <a
              class="text-primary underline underline-offset-2"
              :href="`mailto:${email}`"
              >{{
                email
              }}</a
            >
            that includes:
          </p>
          <ul class="flex list-disc flex-col gap-1.5 pl-5">
            <li>A signature of the rights owner or authorized agent.</li>
            <li>
              Identification of the copyrighted or trademarked work claimed to
              be infringed.
            </li>
            <li>
              Identification of the infringing material and its location on the
              Site.
            </li>
            <li>
              Your contact information (address, telephone number, and email).
            </li>
            <li>
              A statement of good-faith belief that the use is not authorized.
            </li>
            <li>
              A statement, under penalty of perjury, that the information is
              accurate and you are authorized to act.
            </li>
          </ul>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            B. Counter-Notification
          </h3>
          <p>
            If you believe material was removed in error, you may submit a
            counter-notification to
            <a
              class="text-primary underline underline-offset-2"
              :href="`mailto:${email}`"
              >{{
                email
              }}</a
            >
            that includes your signature, identification of the removed
            material, a good-faith statement that removal was a mistake, and
            your contact information and consent to jurisdiction.
          </p>

          <h3 class="text-text mt-4 mb-2 font-semibold">
            C. Repeat Infringers
          </h3>
          <p>
            We reserve the right to terminate accounts of users who are found to
            be repeat infringers.
          </p>
        </section>

        <!-- 10 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            10. Availability
          </h2>
          <p>
            We do not guarantee that the Site or Services will be uninterrupted,
            secure, or error-free. We reserve the right to interrupt or suspend
            the Services at any time, with or without notice.
          </p>
        </section>

        <!-- 11 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            11. Third-Party Links
          </h2>
          <p>
            The Site may contain links to third-party websites. We are not
            responsible for the content, availability, or practices of those
            sites and do not endorse them. Use third-party sites at your own
            risk.
          </p>
        </section>

        <!-- 12 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            12. Disclaimer of Warranties
          </h2>
          <p>
            THE SITE, SERVICES, AND ALL MATERIALS ARE PROVIDED "AS IS" AND "WITH
            ALL FAULTS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
            INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES
            WILL MEET YOUR REQUIREMENTS OR THAT REVIEWS OR LISTINGS ARE
            ACCURATE, COMPLETE, OR CURRENT.
          </p>
        </section>

        <!-- 13 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            13. Limitation of Liability
          </h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW,
            {{ legalName.toUpperCase() }} AND ITS AFFILIATES, OFFICERS,
            DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES
            ARISING FROM YOUR USE OF THE SERVICES. IN NO EVENT WILL OUR TOTAL
            LIABILITY EXCEED THE GREATER OF THE AMOUNT YOU PAID TO US IN THE
            TWELVE (12) MONTHS PRIOR TO THE CLAIM OR $10.00 (USD).
          </p>
          <p class="mt-3">
            Some jurisdictions do not allow certain liability limitations. In
            those jurisdictions, our liability is limited to the greatest extent
            permitted by applicable law.
          </p>
        </section>

        <!-- 14 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            14. Indemnification
          </h2>
          <p>
            You agree to defend, indemnify, and hold harmless {{ legalName }},
            its affiliates, and their respective officers, directors, employees,
            and agents from and against any claims, damages, losses, costs, and
            expenses (including reasonable attorneys' fees) arising from: (a)
            your use of the Services; or (b) your violation of these Terms.
          </p>
        </section>

        <!-- 15 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            15. Termination
          </h2>
          <p>
            We may terminate or suspend your access to the Services at any time,
            with or without notice, for any reason. Upon termination, you must
            stop using the Services. Sections 1, 6, 7, 12, 13, and 14 survive
            termination.
          </p>
        </section>

        <!-- 16 -->
        <section>
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            16. Miscellaneous
          </h2>
          <ul class="flex list-disc flex-col gap-2 pl-5">
            <li>
              <strong class="text-text">Entire Agreement.</strong>
              These Terms constitute the entire agreement between you and
              {{ legalName }} regarding the Services and supersede all prior
              agreements.
            </li>
            <li>
              <strong class="text-text">Severability.</strong>
              If any provision is found unenforceable, it will be severed and
              the remaining provisions will remain in full effect.
            </li>
            <li>
              <strong class="text-text">No Waiver.</strong>
              Our failure to enforce any provision does not constitute a waiver
              of our right to enforce it later.
            </li>
            <li>
              <strong class="text-text">Assignment.</strong>
              You may not assign these Terms without our prior written consent.
              We may assign our rights at any time.
            </li>
          </ul>
        </section>

        <!-- 17 -->
        <section class="pb-4">
          <h2
            class="font-display text-text mb-3 text-xl font-medium tracking-tight"
          >
            17. Contact
          </h2>
          <p>
            For questions about these Terms, contact us at
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
