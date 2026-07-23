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
