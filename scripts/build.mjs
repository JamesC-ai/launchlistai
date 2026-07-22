import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const distDir = new URL("dist/", root);
const publicDir = new URL("public/", root);
const site = "https://launch.pagecheckai.com";
const pages = [
  ["ai-directory-submission-pack", "AI Directory Submission Pack"],
  ["product-hunt-launch-copy-generator", "Product Hunt Launch Copy Generator"],
  ["startup-directory-listing-checklist", "Startup Directory Listing Checklist"],
  ["tool-launch-social-posts", "Tool Launch Social Posts"],
  ["micro-saas-launch-kit", "Micro SaaS Launch Kit"],
];

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });
await cp(publicDir, distDir, { recursive: true });

for (const [slug, title] of pages) {
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
      <p>Use LaunchListAI to turn a product URL and short positioning notes into directory-ready copy, launch posts, and a submission tracker.</p>
      <section class="panel">
        <h2>Generated assets</h2>
        <ul>
          <li>Directory listing tagline and description.</li>
          <li>Product Hunt style maker comment.</li>
          <li>Community post draft and social snippets.</li>
          <li>Checklist for login-only submission steps.</li>
        </ul>
        <a class="primary" href="/#builder">Build launch pack</a>
        <p><a href="https://tools.pagecheckai.com">More PageCheckAI tools</a></p>
      </section>
    </main>
  </body>
</html>`,
  );
}

const urls = ["", "privacy.html", "terms.html", "support.html", ...pages.map(([slug]) => slug)];
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
