import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const distDir = new URL("dist/", root);
const publicDir = new URL("public/", root);
const site = "https://launch.pagecheckai.com";
const packUrl = "https://www.paypal.com/ncp/payment/29SE33AHUSTRC";
const pages = [
  {
    slug: "ai-directory-submission-pack",
    title: "AI Directory Submission Pack",
    description: "Generate directory-ready copy, categories, pricing notes, and a submission tracker for an AI tool.",
    audience: "AI tool makers preparing listings for directories, marketplaces, and launch communities",
    assets: ["One-line tagline", "Short and long descriptions", "Category and keyword notes", "Submission tracker"],
    steps: ["Paste the product URL.", "Add audience and pricing notes.", "Generate the pack.", "Submit manually after login or approval."],
    priority: [
      "Start with the directories that already accept AI tools or micro SaaS launches.",
      "Submit the same core facts consistently, then customize category, audience, and proof for each platform.",
      "Track login, review, paid listing, and rejection states so no channel is repeated by accident.",
    ],
    proofAssets: [
      "Homepage URL and support URL",
      "Pricing, free tier, or service offer",
      "Three screenshots or a short demo outline",
      "Founder note explaining the specific user problem",
    ],
    safety: [
      "Do not submit duplicate spam listings.",
      "Do not claim integrations, funding, users, or results that are not true.",
      "Keep final submission, payment, and account actions manual or explicitly authorized.",
    ],
    faq: [["Will this submit automatically?", "No. It prepares the assets; final submission and login-only steps need authorization."], ["Does it guarantee approval?", "No. Directories make their own review decisions."]],
  },
  {
    slug: "product-hunt-launch-copy-generator",
    title: "Product Hunt Launch Copy Generator",
    description: "Create Product Hunt style launch copy, maker comment drafts, and launch-day social snippets.",
    audience: "founders who need a clearer launch story before posting to Product Hunt or launch communities",
    assets: ["Maker comment", "Tagline options", "First comment outline", "Launch-day post snippets"],
    steps: ["Describe the product promise.", "Add target users.", "Generate launch copy.", "Review claims before posting."],
    priority: [
      "Lead with the painful workflow the product fixes, then name the product after context is clear.",
      "Prepare maker comment, first comment, launch-day posts, and reply templates before launch morning.",
      "Prioritize one strong launch channel instead of scattering weak posts everywhere.",
    ],
    proofAssets: [
      "Clear product URL",
      "Short tagline and problem statement",
      "Screenshots that show the actual workflow",
      "Honest pricing and support details",
    ],
    safety: [
      "Avoid fake traction, fake testimonials, and unsupported claims.",
      "Review every generated post for platform rules and product accuracy.",
      "Manual posting is required for launch platforms and communities.",
    ],
    faq: [["Does it post to Product Hunt?", "No. It only creates drafts and checklists."], ["Can I use it for non-AI products?", "Yes. It works for micro SaaS, templates, and service tools too."]],
  },
  {
    slug: "startup-directory-listing-checklist",
    title: "Startup Directory Listing Checklist",
    description: "Prepare the fields most startup and AI directories ask for before you begin manual submission.",
    audience: "operators submitting a new SaaS or AI product to multiple directories without losing track",
    assets: ["Required field checklist", "Screenshot notes", "Pricing and support copy", "Submission status tracker"],
    steps: ["Generate the checklist.", "Gather missing screenshots.", "Prepare each field.", "Track submitted, pending, and rejected channels."],
    priority: [
      "Rank channels by relevance, domain authority, approval friction, and whether the audience matches the product.",
      "Submit high-fit free directories first, then evaluate paid listings only after basic organic coverage exists.",
      "Keep notes for each rejection or pending review so the next submission improves.",
    ],
    proofAssets: [
      "Canonical URL and product name",
      "Support, privacy, and terms pages",
      "Screenshots, logo, favicon, and concise category",
      "One short description and one longer editorial description",
    ],
    safety: [
      "Respect login walls, captcha, editorial review, and payment prompts.",
      "Do not outsource final truth claims to automation.",
      "Keep a manual approval checkpoint before any public submission.",
    ],
    faq: [["Why not submit everywhere automatically?", "Many directories require login, captcha, editorial review, or paid choices."], ["Can it reduce repeated writing?", "Yes. It creates reusable copy blocks for repeated forms."]],
  },
  {
    slug: "tool-launch-social-posts",
    title: "Tool Launch Social Posts",
    description: "Draft launch posts for X, LinkedIn, Indie Hackers, Reddit, and community updates without overclaiming.",
    audience: "makers who need simple launch posts and follow-up copy for a new tool",
    assets: ["X post", "LinkedIn post", "Community post", "Follow-up reply prompts"],
    steps: ["Add product angle.", "Pick tone.", "Generate drafts.", "Post manually after reviewing platform rules."],
    priority: [
      "Write one problem-led post, one build-in-public note, one practical checklist, and one reply template.",
      "Match the post to the channel: concise for X, proof-led for LinkedIn, discussion-led for communities.",
      "Recycle the same core launch facts without copying the same wording everywhere.",
    ],
    proofAssets: [
      "Product URL and best landing page",
      "Concrete user workflow",
      "Pricing or free-first offer",
      "One screenshot or workflow description",
    ],
    safety: [
      "Do not spam communities or post without reading rules.",
      "Avoid exaggerated revenue, ranking, or automation claims.",
      "Keep replies helpful and disclose founder involvement where appropriate.",
    ],
    faq: [["Will it spam communities?", "No. It prepares drafts. You choose where and whether to post."], ["Can it make posts less salesy?", "Yes. Use the problem-story format and keep direct claims modest."]],
  },
  {
    slug: "micro-saas-launch-kit",
    title: "Micro SaaS Launch Kit",
    description: "Create a lean launch kit for a micro SaaS: positioning, directory listing copy, social drafts, and launch checklist.",
    audience: "solo founders and small teams launching a focused product with limited time",
    assets: ["Positioning summary", "Directory pack", "Social snippets", "Manual submission queue"],
    steps: ["Enter product facts.", "Generate the kit.", "Prioritize channels.", "Submit the highest-fit channels first."],
    priority: [
      "Pick three channels that match the buyer before expanding to broad directories.",
      "Use the launch kit to keep product name, URL, pricing, and value proposition consistent.",
      "Schedule follow-up posts and replies so the launch does not end after the first submission.",
    ],
    proofAssets: [
      "Live product URL",
      "Support and policy pages",
      "Payment or pricing page",
      "Clear before-and-after workflow",
    ],
    safety: [
      "Do not buy paid listings without budget approval.",
      "Do not submit unfinished products as production-ready.",
      "Separate automated draft generation from final public posting.",
    ],
    faq: [["Is this a marketing agency?", "No. It is a self-serve pack generator and checklist."], ["What should I do first?", "Start with directories and communities that match your exact category."]],
  },
  {
    slug: "product-hunt-launch-checklist",
    title: "Product Hunt Launch Checklist",
    description: "Prepare a Product Hunt launch checklist with tagline, maker comment, gallery notes, first comment, and launch-day reply plan.",
    audience: "makers preparing a Product Hunt launch without scrambling on launch morning",
    assets: ["Launch checklist", "Gallery and screenshot notes", "Maker comment prompts", "Launch-day reply queue"],
    steps: ["Prepare product facts.", "Draft launch assets.", "Review claims.", "Post manually after account authorization."],
    priority: [
      "Prepare product URL, tagline, maker note, first comment, screenshots, pricing, support link, and launch time before launch day.",
      "Keep the product promise narrow enough that comments and replies can stay honest.",
      "Prioritize real user questions and support readiness over broad vanity posting.",
    ],
    proofAssets: [
      "Live product URL and support page",
      "Product screenshots that show the actual workflow",
      "Clear pricing or free-first path",
      "Short maker story with no fake traction claims",
    ],
    safety: [
      "Do not post fake reviews, fake maker comments, or unsupported traction claims.",
      "Do not automate final Product Hunt posting or replies without explicit authorization.",
      "Stop when login, captcha, payment, or platform risk prompts appear.",
    ],
    faq: [["Can it schedule Product Hunt for me?", "No. It prepares the checklist and copy; account actions require authorization."], ["What matters most on launch day?", "A clear product page, honest maker note, working site, payment/support health, and useful replies."]],
  },
  {
    slug: "betalist-submission-checklist",
    title: "BetaList Submission Checklist",
    description: "Prepare BetaList-style startup listing copy, launch status notes, screenshots, categories, and manual submission fields.",
    audience: "founders preparing an early-stage product listing for BetaList or similar startup directories",
    assets: ["Startup summary", "Launch status note", "Screenshot checklist", "Manual submission field list"],
    steps: ["Confirm launch status.", "Gather screenshots.", "Generate listing copy.", "Submit manually after login and rule review."],
    priority: [
      "Use BetaList only when the product fits an early-stage startup or beta audience.",
      "Make launch stage, pricing, and access status clear so reviewers do not misclassify the product.",
      "Track whether the listing is free, paid, pending, rejected, or needs more assets.",
    ],
    proofAssets: [
      "Product homepage and waitlist or signup path",
      "Screenshots or short demo sequence",
      "Category, stage, and target audience",
      "Founder note and support contact",
    ],
    safety: [
      "Do not pay for placement without explicit budget approval.",
      "Do not imply beta access exists if the product is not ready.",
      "Respect review queues and do not submit duplicates.",
    ],
    faq: [["Can I submit any product?", "Only if the directory rules and audience fit. Some products are not a good match."], ["Does it fill the form automatically?", "No. It prepares the fields for manual submission."]],
  },
  {
    slug: "alternativeto-listing-prep",
    title: "AlternativeTo Listing Prep",
    description: "Prepare AlternativeTo listing facts, category positioning, comparison notes, screenshots, and safe claims for a software product.",
    audience: "software makers preparing an AlternativeTo-style product profile",
    assets: ["Category and alternative notes", "Short product description", "Screenshot list", "Safe comparison copy"],
    steps: ["Define the product category.", "List honest alternatives.", "Generate profile copy.", "Review comparisons before submission."],
    priority: [
      "Position the product by workflow and category instead of attacking competitors.",
      "Use factual comparison language that a directory editor can verify.",
      "Prepare screenshots, OS/platform notes, pricing, and official URL before login.",
    ],
    proofAssets: [
      "Official product URL",
      "Platform and pricing notes",
      "Screenshots showing the real product",
      "Clear category and use-case description",
    ],
    safety: [
      "Do not make unverifiable superiority claims.",
      "Do not submit as an alternative to unrelated products just to get traffic.",
      "Manual review is required before any public comparison copy is posted.",
    ],
    faq: [["Can it write comparison copy?", "Yes, but you must review every comparison for truth and fairness."], ["Does it submit to AlternativeTo?", "No. It prepares the listing assets."]],
  },
  {
    slug: "ai-tool-directory-submission-checklist",
    title: "AI Tool Directory Submission Checklist",
    description: "Prepare Toolify, ThereIsAnAIForThat, AI directories, and niche listing fields with categories, tags, screenshots, and safe claims.",
    audience: "AI tool makers submitting to AI directories without repeating the same writing from scratch",
    assets: ["AI directory field map", "Category and tag suggestions", "Screenshot notes", "Submission status tracker"],
    steps: ["Enter product facts.", "Generate directory fields.", "Customize per platform.", "Submit manually after reviewing rules."],
    priority: [
      "Start with AI directories that match the product category and buyer intent.",
      "Use consistent product facts while adjusting tags and categories for each platform.",
      "Track which listings require login, paid options, editorial review, or screenshots.",
    ],
    proofAssets: [
      "Live AI tool URL",
      "Short workflow description",
      "Pricing and support details",
      "Screenshots or demo outline",
    ],
    safety: [
      "Do not submit tools that are not live enough for review.",
      "Do not choose misleading AI categories.",
      "Do not bypass login, captcha, paid placements, or final submission confirmation.",
    ],
    faq: [["Which directory should I submit first?", "Start with the directory whose audience matches your tool's exact use case."], ["Can it do bulk submission?", "No. It prepares fields and a queue; public submission stays manual or explicitly authorized."]],
  },
  {
    slug: "launch-screenshot-checklist",
    title: "Launch Screenshot Checklist",
    description: "Plan screenshots for Product Hunt, directories, and social posts with workflow, proof, pricing, support, and privacy checks.",
    audience: "makers preparing launch gallery images and directory screenshots",
    assets: ["Screenshot shot list", "Gallery order", "Caption prompts", "Privacy review checklist"],
    steps: ["List the workflow screens.", "Pick three to five proof screenshots.", "Review private data.", "Export screenshots for each channel."],
    priority: [
      "Show the actual workflow before decorative or marketing visuals.",
      "Use screenshots that prove the product does something specific.",
      "Keep pricing, support, and privacy screens ready when directories ask for trust signals.",
    ],
    proofAssets: [
      "Home screen or tool input",
      "Generated output or result screen",
      "Pricing or checkout path",
      "Support and policy page links",
    ],
    safety: [
      "Remove private data, API keys, customer names, and test credentials from screenshots.",
      "Do not fabricate product UI states that do not exist.",
      "Review image dimensions and platform rules before upload.",
    ],
    faq: [["How many screenshots are enough?", "Three to five clear workflow screenshots are often better than many vague images."], ["Should I include pricing?", "Include it when it helps the reviewer understand the offer and buyer path."]],
  },
  {
    slug: "maker-comment-generator",
    title: "Maker Comment Generator",
    description: "Draft an honest maker comment for launch platforms with problem context, product scope, pricing, boundaries, and invite for feedback.",
    audience: "founders writing a first maker comment for Product Hunt, Microlaunch, or community launches",
    assets: ["Maker comment", "Short founder note", "Feedback prompts", "Boundary statement"],
    steps: ["Add why you built it.", "Describe who it helps.", "Generate comment drafts.", "Review for accuracy before posting."],
    priority: [
      "Explain the narrow pain point before listing features.",
      "Say what is live now, what is paid, and what is still manual.",
      "Invite specific feedback that can improve the product.",
    ],
    proofAssets: [
      "Product URL",
      "Specific user workflow",
      "Known limitations or manual boundaries",
      "Support and pricing path",
    ],
    safety: [
      "Do not pretend to be a user or reviewer.",
      "Do not invent traction, revenue, investor, or customer claims.",
      "Do not post publicly until the account owner approves the final text.",
    ],
    faq: [["Should the maker comment be personal?", "Yes, but it should stay specific and truthful."], ["Can I reuse it elsewhere?", "Yes, adapt it for each platform's norms."]],
  },
  {
    slug: "directory-submission-tracker",
    title: "Directory Submission Tracker",
    description: "Create a directory submission tracker for product URL, platform, status, login needs, screenshots, paid options, and follow-up notes.",
    audience: "operators submitting one product to multiple directories and launch communities",
    assets: ["Submission tracker", "Status labels", "Follow-up notes", "Risk and authorization queue"],
    steps: ["Generate the tracker.", "Add platform-specific requirements.", "Mark account or payment blockers.", "Update status after every submission attempt."],
    priority: [
      "Track status before adding more channels so the launch does not become chaotic.",
      "Separate ready-to-submit channels from login, captcha, paid, or editorial-review blockers.",
      "Record rejection reasons and required edits for future submissions.",
    ],
    proofAssets: [
      "Product URL and canonical name",
      "Prepared listing copy",
      "Screenshot folder",
      "Submission outcome notes",
    ],
    safety: [
      "Do not retry rejected listings blindly.",
      "Do not use paid channels without approval.",
      "Stop on account risk prompts, captcha, or platform warnings.",
    ],
    faq: [["Why use a tracker?", "It prevents duplicate submissions, missed follow-ups, and accidental paid actions."], ["Can it track multiple products?", "Yes, but each product should keep its own canonical facts."]],
  },
  {
    slug: "launch-day-checklist",
    title: "Launch Day Checklist",
    description: "Prepare a launch-day checklist for website health, payment links, support page, Product Hunt comments, social drafts, and follow-up tasks.",
    audience: "makers running a launch day without wanting to miss site, payment, or reply checks",
    assets: ["Launch-day timeline", "Health checks", "Reply drafts", "Follow-up actions"],
    steps: ["Check the website.", "Verify payment and support.", "Monitor comments.", "Draft replies and follow-ups for approval."],
    priority: [
      "Verify homepage, support, privacy, terms, payment links, and sitemap before public traffic arrives.",
      "Prepare helpful replies before launch, then update them based on real comments.",
      "Keep follow-up tasks for directories, social posts, and support questions after the first rush.",
    ],
    proofAssets: [
      "Live site and fallback URL",
      "Working payment link",
      "Support page and contact",
      "Launch page and social drafts",
    ],
    safety: [
      "Do not post public replies without account owner approval.",
      "Do not make unsupported claims in fast replies.",
      "Escalate login, captcha, payment, or risk prompts.",
    ],
    faq: [["What should I check first?", "Website health, payment path, support page, and launch page visibility."], ["Can replies be automated?", "Drafts can be prepared, but public replies need approval."]],
  },
  {
    slug: "post-launch-follow-up-plan",
    title: "Post-Launch Follow-Up Plan",
    description: "Plan post-launch follow-up tasks: directory updates, sitemap refresh, social recap, comment replies, lead searches, and support cleanup.",
    audience: "makers who launched a tool and need a practical follow-up plan instead of stopping after launch day",
    assets: ["Post-launch checklist", "Directory update queue", "Recap post drafts", "Lead-search prompts"],
    steps: ["Collect launch outcomes.", "Update listings and owned pages.", "Prepare recap drafts.", "Queue follow-up replies for approval."],
    priority: [
      "Update owned pages and sitemaps after a launch proof point exists.",
      "Follow up on comments and questions with useful answers instead of sales pressure.",
      "Turn launch feedback into product fixes, FAQ updates, and better directory copy.",
    ],
    proofAssets: [
      "Launch URL or proof link",
      "Comment questions and objections",
      "Site analytics or support notes if available",
      "Updated screenshots and FAQ copy",
    ],
    safety: [
      "Do not imply launch rankings or results unless verified.",
      "Do not scrape or spam commenters.",
      "Keep outreach low-volume, relevant, and opt-out friendly.",
    ],
    faq: [["What happens after launch day?", "Refresh owned pages, answer real questions, update directory assets, and prepare careful follow-ups."], ["Can I use launch feedback for SEO?", "Yes, turn common questions into helpful pages or FAQ entries."]],
  },
  {
    slug: "waitlist-launch-copy",
    title: "Waitlist Launch Copy",
    description: "Draft waitlist launch copy for a product that is not fully public yet, with access status, audience, invite wording, and safety boundaries.",
    audience: "founders validating a product before full public release",
    assets: ["Waitlist page copy", "Invite post", "Early access notes", "Feedback request"],
    steps: ["Describe who should join.", "Clarify what is available now.", "Generate waitlist copy.", "Review before posting publicly."],
    priority: [
      "Be clear whether the product is live, private beta, waitlist, or service-assisted.",
      "Ask for a specific kind of early user instead of collecting broad unqualified interest.",
      "Prepare follow-up questions before inviting users.",
    ],
    proofAssets: [
      "Waitlist or signup URL",
      "Access status",
      "Target user description",
      "Privacy, support, and expectation notes",
    ],
    safety: [
      "Do not imply immediate access if users will wait.",
      "Do not collect sensitive data without a clear reason.",
      "Do not promise outcomes from an unfinished product.",
    ],
    faq: [["Can I launch before the product is fully ready?", "Yes, if the access status and limitations are honest."], ["What should the waitlist ask for?", "Only the information needed to qualify and contact early users."]],
  },
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function faq(items) {
  return items.map(([q, a]) => `<article class="panel seo-card"><h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p></article>`).join("");
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });

for (const page of pages) {
  const { slug, title } = page;
  await mkdir(new URL(`${slug}/`, distDir), { recursive: true });
  await writeFile(
    new URL(`${slug}/index.html`, distDir),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - LaunchListAI</title>
    <meta name="description" content="Generate launch directory listing copy, social drafts, and submission checklists for a focused SaaS or AI tool." />
    <link rel="icon" href="/favicon.svg" />
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main class="shell seo-page">
      <a class="eyebrow" href="/">LaunchListAI</a>
      <h1>${title}</h1>
      <p>${escapeHtml(page.description)}</p>
      <div class="button-row">
        <a class="primary" href="/#builder">Build launch pack</a>
        <a class="secondary" href="${packUrl}">Buy $99 pack</a>
      </div>
      <section class="seo-grid" aria-label="LaunchListAI page details">
        <article class="panel seo-card">
          <h2>Who this helps</h2>
          <p>${escapeHtml(page.audience)}.</p>
        </article>
        <article class="panel seo-card">
          <h2>Generated assets</h2>
          ${list(page.assets)}
        </article>
      </section>
      <section class="panel seo-card">
        <h2>Workflow</h2>
        ${list(page.steps)}
      </section>
      <section class="panel seo-card">
        <h2>Operating boundary</h2>
        <p>LaunchListAI generates drafts and checklists. It does not log into platforms, bypass captcha, submit final listings, buy ads, or guarantee directory approval.</p>
      </section>
      <section class="seo-grid" aria-label="Launch operations details">
        <article class="panel seo-card">
          <h2>Channel priority logic</h2>
          ${list(page.priority)}
        </article>
        <article class="panel seo-card">
          <h2>Proof assets to prepare</h2>
          ${list(page.proofAssets)}
        </article>
        <article class="panel seo-card">
          <h2>Submission safety rules</h2>
          ${list(page.safety)}
        </article>
        <article class="panel seo-card">
          <h2>Manual approval checkpoint</h2>
          <p>Before any final post or directory submission, review the product URL, screenshots, category, pricing, support link, claims, and platform rules. LaunchListAI keeps the work organized, but the account owner should approve public actions.</p>
        </article>
      </section>
      <section class="seo-grid" aria-label="Frequently asked questions">
        ${faq(page.faq)}
      </section>
      <p><a href="https://tools.pagecheckai.com">More PageCheckAI tools</a></p>
    </main>
  </body>
</html>`,
  );
}

const urls = ["", "privacy.html", "terms.html", "support.html", ...pages.map((page) => page.slug)];
await writeFile(
  new URL("robots.txt", distDir),
  `User-agent: *
Allow: /
Sitemap: ${site}/sitemap.xml
`,
);
await writeFile(
  new URL("sitemap.xml", distDir),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${site}/${url}</loc></url>`).join("\n")}
</urlset>
`,
);
console.log("Built LaunchListAI.");
