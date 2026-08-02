import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders LaunchListAI builder", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /LaunchListAI/);
  assert.match(html, /Generate launch pack/);
  assert.match(html, /Build free launch kit/);
  assert.match(html, /Check paid fit/);
  assert.match(html, /Free launch kit first/);
  assert.match(html, /\$99 only after submission-ready/);
  assert.match(html, /Good fit for the \$99 pack/);
  assert.match(html, /Skip payment when/);
  assert.match(html, /Product Hunt/);
  assert.match(html, /Final submission/);
  assert.match(html, /Launch guides/);
  assert.match(html, /Product Hunt checklist/);
  assert.match(html, /AI directories/);
  assert.match(html, /Microlaunch/);
  assert.match(html, /Press kit/);
  assert.match(html, /Listing copy/);
  assert.match(html, /Metrics/);
  assert.match(html, /Gallery/);
  assert.match(html, /Reply queue/);
  assert.match(html, /Pricing disclosure/);
  assert.match(html, /Support triage/);
  assert.match(html, /First comment/);
  assert.match(html, /Demo script/);
  assert.match(html, /Category fit/);
  assert.match(html, /Feedback survey/);
  assert.match(html, /Bug triage/);
  assert.match(html, /Community rules/);
  assert.match(html, /UTM links/);
  assert.match(html, /Changelog/);
  assert.match(html, /Accessibility/);
  assert.match(html, /Objection map/);
  assert.match(html, /Founder update/);
  assert.match(html, /namebatch\.pagecheckai\.com\/api\/checkout\?v=launchlist-20260731&amp;product=launchlistai/);
  assert.match(html, /id="downloadPaidPack"[^>]*disabled/);
  assert.match(html, /https:\/\/www\.paypal\.com\/ncp\/payment\/29SE33AHUSTRC/);
  assert.match(html, /After payment, enter the LL- activation code above/);
  assert.match(html, /open support/);
});

test("ships browser-local launch generator", async () => {
  const script = await readFile(new URL("../dist/app.js", import.meta.url), "utf8");
  assert.match(script, /function generate/);
  assert.match(script, /LaunchListAI pack/);
  assert.match(script, /function paidPackText/);
  assert.match(script, /Paid handoff checklist/);
  assert.match(script, /Channel tracker/);
  assert.match(script, /launchlistai-directory-submission-pack\.txt/);
  assert.match(script, /https:\/\/namebatch\.pagecheckai\.com\/api\/licenses\/verify/);
  assert.match(script, /JSON\.stringify\(\{ code, product: "launchlistai" \}\)/);
  assert.match(script, /directory_submission_pack/);
  assert.doesNotMatch(script, /JSON\.stringify\(\{[^}]*notes/i);
  assert.doesNotMatch(script, /JSON\.stringify\(\{[^}]*listingOutput/i);
  assert.match(script, /AlternativeTo/);
});

test("includes policy support and SEO discovery files", async () => {
  const robots = await readFile(new URL("../dist/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
  const terms = await readFile(new URL("../dist/terms.html", import.meta.url), "utf8");
  const support = await readFile(new URL("../dist/support.html", import.meta.url), "utf8");
  const indexNowKey = await readFile(new URL("../dist/5211ab56e638ea380b1b270ab15c79d9.txt", import.meta.url), "utf8");
  const indexNowScript = await readFile(new URL("../scripts/submit-indexnow.mjs", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/launch\.pagecheckai\.com\/sitemap\.xml/);
  assert.match(sitemap, /ai-directory-submission-pack/);
  assert.match(sitemap, /micro-saas-launch-kit/);
  assert.match(sitemap, /product-hunt-launch-checklist/);
  assert.match(sitemap, /betalist-submission-checklist/);
  assert.match(sitemap, /alternativeto-listing-prep/);
  assert.match(sitemap, /ai-tool-directory-submission-checklist/);
  assert.match(sitemap, /launch-screenshot-checklist/);
  assert.match(sitemap, /maker-comment-generator/);
  assert.match(sitemap, /directory-submission-tracker/);
  assert.match(sitemap, /launch-day-checklist/);
  assert.match(sitemap, /post-launch-follow-up-plan/);
  assert.match(sitemap, /waitlist-launch-copy/);
  assert.match(sitemap, /microlaunch-submission-checklist/);
  assert.match(sitemap, /saas-launch-announcement-email/);
  assert.match(sitemap, /product-launch-press-kit-checklist/);
  assert.match(sitemap, /startup-launch-timeline-template/);
  assert.match(sitemap, /product-tagline-generator/);
  assert.match(sitemap, /directory-listing-description-generator/);
  assert.match(sitemap, /product-launch-faq-template/);
  assert.match(sitemap, /launch-asset-folder-checklist/);
  assert.match(sitemap, /directory-rejection-follow-up-checklist/);
  assert.match(sitemap, /product-launch-metrics-tracker/);
  for (const route of [
    "product-hunt-gallery-checklist",
    "launch-reply-moderation-queue",
    "launch-pricing-disclosure-checklist",
    "founder-bio-for-launch-profile",
    "no-code-product-launch-checklist",
    "ai-tool-launch-keyword-map",
    "localized-launch-listing-checklist",
    "newsletter-launch-pitch-checklist",
    "affiliate-referral-launch-disclosure",
    "launch-support-inbox-triage",
    "product-hunt-first-comment-template",
    "launch-demo-video-script",
    "directory-category-selection-checklist",
    "launch-testimonial-request-template",
    "early-user-feedback-survey",
    "appsumo-launch-listing-checklist",
    "launch-roadmap-disclosure-template",
    "launch-bug-report-triage",
    "launch-refund-policy-faq",
    "launch-content-calendar-template",
    "launch-community-rules-checklist",
    "launch-utm-link-checklist",
    "product-launch-changelog-template",
    "product-launch-accessibility-checklist",
    "directory-screenshot-alt-text-checklist",
    "launch-competitor-comparison-notes",
    "product-launch-objection-map",
    "trial-signup-onboarding-email",
    "post-launch-founder-update",
    "product-demo-for-newsletter-pitch",
    "directory-listing-update-request-template",
    "launch-screenshot-version-log",
    "product-launch-broken-link-checklist",
    "launch-pricing-change-announcement-draft",
    "product-launch-status-page-message",
    "directory-profile-ownership-handoff",
    "launch-asset-permission-log",
    "launch-duplicate-listing-audit",
    "post-launch-support-faq-update",
    "launch-campaign-archive-handoff",
    "launch-directory-login-handoff-checklist",
    "launch-review-quote-permission-checklist",
    "launch-founder-dm-reply-draft",
    "launch-alternativeto-update-brief",
    "launch-toolify-listing-refresh",
    "launch-beta-user-invite-copy",
    "launch-lifetime-deal-terms-checklist",
    "launch-influencer-announcement-brief",
    "launch-demo-account-safety-checklist",
    "launch-post-mortem-template",
  ]) {
    assert.match(sitemap, new RegExp(route));
  }
  assert.equal((sitemap.match(/<loc>/g) || []).length, 79);
  assert.match(terms, /does not guarantee directory approval/i);
  assert.match(terms, /Paid packs are browser-generated planning files/);
  assert.match(terms, /does not bypass captcha/);
  assert.match(support, /LaunchListAI support/);
  assert.match(support, /generated locally/i);
  assert.match(support, /namebatch\.pagecheckai\.com\/api\/checkout\?v=launchlist-20260731&amp;product=launchlistai/);
  assert.match(support, /https:\/\/www\.paypal\.com\/ncp\/payment\/29SE33AHUSTRC/);
  assert.equal(indexNowKey.trim(), "5211ab56e638ea380b1b270ab15c79d9");
  assert.match(indexNowScript, /api\.indexnow\.org\/indexnow/);
});

test("builds thick launch SEO pages with submission safeguards", async () => {
  const directoryPage = await readFile(new URL("../dist/ai-directory-submission-pack/index.html", import.meta.url), "utf8");
  const socialPage = await readFile(new URL("../dist/tool-launch-social-posts/index.html", import.meta.url), "utf8");
  assert.match(directoryPage, /Channel priority logic/);
  assert.match(directoryPage, /Proof assets to prepare/);
  assert.match(directoryPage, /Submission safety rules/);
  assert.match(directoryPage, /Manual approval checkpoint/);
  assert.match(directoryPage, /When the \$99 directory pack is worth it/);
  assert.match(directoryPage, /Start with the free browser-local launch kit/);
  assert.match(directoryPage, /Do not submit duplicate spam listings/);
  assert.match(socialPage, /Do not spam communities or post without reading rules/);
  assert.match(socialPage, /Match the post to the channel/);
});

test("builds new launch operations SEO pages", async () => {
  const launchDayPage = await readFile(new URL("../dist/launch-day-checklist/index.html", import.meta.url), "utf8");
  const trackerPage = await readFile(new URL("../dist/directory-submission-tracker/index.html", import.meta.url), "utf8");
  const waitlistPage = await readFile(new URL("../dist/waitlist-launch-copy/index.html", import.meta.url), "utf8");
  assert.match(launchDayPage, /Do not post public replies without account owner approval/);
  assert.match(launchDayPage, /Website health, payment path, support page/i);
  assert.match(trackerPage, /Stop on account risk prompts, captcha, or platform warnings/);
  assert.match(waitlistPage, /Do not imply immediate access if users will wait/);
});

test("builds outreach, rejection, and metrics pages with safe execution boundaries", async () => {
  const emailPage = await readFile(new URL("../dist/saas-launch-announcement-email/index.html", import.meta.url), "utf8");
  const rejectionPage = await readFile(new URL("../dist/directory-rejection-follow-up-checklist/index.html", import.meta.url), "utf8");
  const metricsPage = await readFile(new URL("../dist/product-launch-metrics-tracker/index.html", import.meta.url), "utf8");
  const microlaunchPage = await readFile(new URL("../dist/microlaunch-submission-checklist/index.html", import.meta.url), "utf8");
  assert.match(emailPage, /Do not buy lists, scrape private addresses, or send indiscriminate bulk email/);
  assert.match(emailPage, /Final recipient selection and sending require authorization/);
  assert.match(rejectionPage, /Do not harass editors, evade bans, create duplicate accounts/);
  assert.match(metricsPage, /Do not claim attribution, revenue, rankings, or conversion lifts/);
  assert.match(microlaunchPage, /namebatch\.pagecheckai\.com\/api\/checkout\?v=launchlist-20260731&product=launchlistai/);
});

test("builds gallery, reply, pricing, and support pages with launch safeguards", async () => {
  const galleryPage = await readFile(new URL("../dist/product-hunt-gallery-checklist/index.html", import.meta.url), "utf8");
  const replyPage = await readFile(new URL("../dist/launch-reply-moderation-queue/index.html", import.meta.url), "utf8");
  const pricingPage = await readFile(new URL("../dist/launch-pricing-disclosure-checklist/index.html", import.meta.url), "utf8");
  const supportPage = await readFile(new URL("../dist/launch-support-inbox-triage/index.html", import.meta.url), "utf8");
  assert.match(galleryPage, /Do not upload fake UI states, customer data, secrets, or unlicensed media/);
  assert.match(replyPage, /Do not post public replies without authorization/);
  assert.match(replyPage, /founder or maker disclosure/i);
  assert.match(pricingPage, /Do not invent refunds, guarantees, discounts, or subscription terms/);
  assert.match(supportPage, /Sensitive replies and account changes require authorization/);
  assert.match(supportPage, /namebatch\.pagecheckai\.com\/api\/checkout\?v=launchlist-20260731&product=launchlistai/);
});

test("builds first-comment, demo, category, feedback, and launch operations pages", async () => {
  const firstCommentPage = await readFile(new URL("../dist/product-hunt-first-comment-template/index.html", import.meta.url), "utf8");
  const demoPage = await readFile(new URL("../dist/launch-demo-video-script/index.html", import.meta.url), "utf8");
  const categoryPage = await readFile(new URL("../dist/directory-category-selection-checklist/index.html", import.meta.url), "utf8");
  const testimonialPage = await readFile(new URL("../dist/launch-testimonial-request-template/index.html", import.meta.url), "utf8");
  const feedbackPage = await readFile(new URL("../dist/early-user-feedback-survey/index.html", import.meta.url), "utf8");
  const appsumoPage = await readFile(new URL("../dist/appsumo-launch-listing-checklist/index.html", import.meta.url), "utf8");
  const roadmapPage = await readFile(new URL("../dist/launch-roadmap-disclosure-template/index.html", import.meta.url), "utf8");
  const bugPage = await readFile(new URL("../dist/launch-bug-report-triage/index.html", import.meta.url), "utf8");
  const refundPage = await readFile(new URL("../dist/launch-refund-policy-faq/index.html", import.meta.url), "utf8");
  const calendarPage = await readFile(new URL("../dist/launch-content-calendar-template/index.html", import.meta.url), "utf8");
  assert.match(firstCommentPage, /Do not post the first comment without account owner approval/);
  assert.match(demoPage, /Do not record private data, customer details, secrets, or real credentials/);
  assert.match(categoryPage, /Do not place a product in unrelated categories just to chase traffic/);
  assert.match(testimonialPage, /Do not fabricate testimonials, reviews, customer logos, or endorsements/);
  assert.match(feedbackPage, /Do not collect sensitive personal data unless it is truly needed/);
  assert.match(appsumoPage, /Do not create paid listings, discounts, coupons, or deal terms without authorization/);
  assert.match(roadmapPage, /Do not promise dates, integrations, compliance outcomes, or enterprise features unless approved/);
  assert.match(bugPage, /Do not ask users to send passwords, payment details, or sensitive files/);
  assert.match(refundPage, /Refund decisions and account\/payment actions require authorization/);
  assert.match(calendarPage, /Do not send bulk outreach, paid ads, or private messages without authorization/);
});

test("builds post-launch quality, tracking, and community pages with safeguards", async () => {
  const rulesPage = await readFile(new URL("../dist/launch-community-rules-checklist/index.html", import.meta.url), "utf8");
  const utmPage = await readFile(new URL("../dist/launch-utm-link-checklist/index.html", import.meta.url), "utf8");
  const accessibilityPage = await readFile(
    new URL("../dist/product-launch-accessibility-checklist/index.html", import.meta.url),
    "utf8",
  );
  const altTextPage = await readFile(
    new URL("../dist/directory-screenshot-alt-text-checklist/index.html", import.meta.url),
    "utf8",
  );
  const competitorPage = await readFile(
    new URL("../dist/launch-competitor-comparison-notes/index.html", import.meta.url),
    "utf8",
  );
  const onboardingPage = await readFile(new URL("../dist/trial-signup-onboarding-email/index.html", import.meta.url), "utf8");
  assert.match(rulesPage, /Do not post in communities that ban self-promotion/);
  assert.match(utmPage, /Do not claim exact revenue, ranking, or conversion attribution/);
  assert.match(accessibilityPage, /Do not claim WCAG, ADA, legal, or compliance certification/);
  assert.match(altTextPage, /Do not describe fake UI states, private customer data, or unavailable features/);
  assert.match(competitorPage, /Do not make defamatory, misleading, or unverifiable competitor claims/);
  assert.match(onboardingPage, /Final sending, account connection, bulk outreach/);
});

test("builds listing maintenance, ownership, support, and archive pages safely", async () => {
  const updatePage = await readFile(new URL("../dist/directory-listing-update-request-template/index.html", import.meta.url), "utf8");
  const linkPage = await readFile(new URL("../dist/product-launch-broken-link-checklist/index.html", import.meta.url), "utf8");
  const pricingPage = await readFile(new URL("../dist/launch-pricing-change-announcement-draft/index.html", import.meta.url), "utf8");
  const ownershipPage = await readFile(new URL("../dist/directory-profile-ownership-handoff/index.html", import.meta.url), "utf8");
  const duplicatePage = await readFile(new URL("../dist/launch-duplicate-listing-audit/index.html", import.meta.url), "utf8");
  const archivePage = await readFile(new URL("../dist/launch-campaign-archive-handoff/index.html", import.meta.url), "utf8");
  assert.match(updatePage, /Final update requests and public changes require authorization/i);
  assert.match(linkPage, /Do not log into accounts or change DNS, redirects, listings, or payment settings/i);
  assert.match(pricingPage, /Do not invent discounts, grandfathering, refunds, guarantees, or billing terms/i);
  assert.match(ownershipPage, /Do not put passwords, backup codes, session cookies, or secrets/i);
  assert.match(duplicatePage, /Do not report, delete, claim, merge, or edit listings automatically/i);
  assert.match(archivePage, /Do not archive credentials, payment data, private customer data, or unlicensed assets/i);
});

test("builds account handoff, invite, deal, and post-mortem pages safely", async () => {
  const loginPage = await readFile(
    new URL("../dist/launch-directory-login-handoff-checklist/index.html", import.meta.url),
    "utf8",
  );
  const quotePage = await readFile(
    new URL("../dist/launch-review-quote-permission-checklist/index.html", import.meta.url),
    "utf8",
  );
  const dmPage = await readFile(new URL("../dist/launch-founder-dm-reply-draft/index.html", import.meta.url), "utf8");
  const toolifyPage = await readFile(new URL("../dist/launch-toolify-listing-refresh/index.html", import.meta.url), "utf8");
  const dealPage = await readFile(new URL("../dist/launch-lifetime-deal-terms-checklist/index.html", import.meta.url), "utf8");
  const demoPage = await readFile(new URL("../dist/launch-demo-account-safety-checklist/index.html", import.meta.url), "utf8");
  const postMortemPage = await readFile(new URL("../dist/launch-post-mortem-template/index.html", import.meta.url), "utf8");
  assert.match(loginPage, /Do not store passwords, backup codes, cookies, or one-time codes/i);
  assert.match(quotePage, /Do not fabricate testimonials, customer logos, endorsements, or results/i);
  assert.match(dmPage, /Do not send DMs automatically or in bulk/i);
  assert.match(toolifyPage, /Do not promise ranking, traffic, leads, sales, or directory approval/i);
  assert.match(dealPage, /Do not create discounts, coupons, payment links, or deal pages/i);
  assert.match(demoPage, /Do not put passwords, API keys, backup codes, or payment data in launch docs/i);
  assert.match(postMortemPage, /Do not claim revenue, rankings, traffic, conversion, or causation without evidence/i);
  assert.match(postMortemPage, /namebatch\.pagecheckai\.com\/api\/checkout\?v=launchlist-20260731&product=launchlistai/);
});
