import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("renders LaunchListAI builder", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(html, /LaunchListAI/);
  assert.match(html, /Generate launch pack/);
  assert.match(html, /Product Hunt/);
  assert.match(html, /Final submission/);
  assert.match(html, /https:\/\/www\.paypal\.com\/ncp\/payment\/29SE33AHUSTRC/);
});

test("ships browser-local launch generator", async () => {
  const script = await readFile(new URL("../dist/app.js", import.meta.url), "utf8");
  assert.match(script, /function generate/);
  assert.match(script, /LaunchListAI pack/);
  assert.match(script, /AlternativeTo/);
  assert.doesNotMatch(script, /fetch\(/);
});

test("includes policy support and SEO discovery files", async () => {
  const robots = await readFile(new URL("../dist/robots.txt", import.meta.url), "utf8");
  const sitemap = await readFile(new URL("../dist/sitemap.xml", import.meta.url), "utf8");
  const terms = await readFile(new URL("../dist/terms.html", import.meta.url), "utf8");
  const support = await readFile(new URL("../dist/support.html", import.meta.url), "utf8");
  assert.match(robots, /Sitemap: https:\/\/launch\.pagecheckai\.com\/sitemap\.xml/);
  assert.match(sitemap, /ai-directory-submission-pack/);
  assert.match(sitemap, /micro-saas-launch-kit/);
  assert.match(terms, /does not guarantee directory approval/i);
  assert.match(support, /LaunchListAI support/);
  assert.match(support, /https:\/\/www\.paypal\.com\/ncp\/payment\/29SE33AHUSTRC/);
});
