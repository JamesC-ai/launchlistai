import { readFile } from "node:fs/promises";

const host = "launch.pagecheckai.com";
const key = "5211ab56e638ea380b1b270ab15c79d9";
const keyLocation = `https://${host}/${key}.txt`;
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

if (urlList.length === 0) {
  throw new Error("No URLs found in dist/sitemap.xml");
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation,
    urlList,
  }),
});

const body = await response.text();
console.log(`IndexNow submitted ${urlList.length} URLs: ${response.status} ${response.statusText}`);
if (body.trim()) {
  console.log(body);
}

if (!response.ok && response.status !== 202) {
  throw new Error(`IndexNow submission failed with ${response.status}`);
}
