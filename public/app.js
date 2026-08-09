const fields = {
  accountOwner: document.querySelector("#accountOwner"),
  audience: document.querySelector("#audience"),
  assetOwner: document.querySelector("#assetOwner"),
  category: document.querySelector("#category"),
  checklistOutput: document.querySelector("#checklistOutput"),
  activatePack: document.querySelector("#activatePack"),
  copyAll: document.querySelector("#copyAll"),
  downloadPaidPack: document.querySelector("#downloadPaidPack"),
  emailPack: document.querySelector("#emailPack"),
  listingOutput: document.querySelector("#listingOutput"),
  makerOutput: document.querySelector("#makerOutput"),
  notes: document.querySelector("#notes"),
  offer: document.querySelector("#offer"),
  outcome: document.querySelector("#outcome"),
  pain: document.querySelector("#pain"),
  proCode: document.querySelector("#proCode"),
  proStatus: document.querySelector("#proStatus"),
  productName: document.querySelector("#productName"),
  productUrl: document.querySelector("#productUrl"),
  socialOutput: document.querySelector("#socialOutput"),
};

const LICENSE_VERIFY_URL = "https://namebatch.pagecheckai.com/api/licenses/verify";
const LICENSE_STORAGE_KEY = "launchlistai-paid-code";
let paidPackActive = false;

const directories = [
  "Product Hunt",
  "BetaList",
  "Microlaunch",
  "AlternativeTo",
  "ThereIsAnAIForThat",
  "Toolify",
  "Indie Hackers",
  "Relevant Reddit communities",
];

function value(node, fallback = "") {
  return node.value.trim() || fallback;
}

function values() {
  return {
    accountOwner: value(fields.accountOwner, "not assigned"),
    audience: value(fields.audience, "busy operators"),
    assetOwner: value(fields.assetOwner, "not assigned"),
    category: fields.category.value,
    notes: value(fields.notes),
    offer: value(fields.offer, "free tool"),
    outcome: value(fields.outcome, "a faster workflow"),
    pain: value(fields.pain, "a painful manual process"),
    productName: value(fields.productName, "the product"),
    productUrl: value(fields.productUrl, "https://example.com"),
  };
}

function generate() {
  const v = values();
  const tagline = `${v.productName} helps ${v.audience} get ${v.outcome}.`;

  fields.listingOutput.textContent = `Product: ${v.productName}
URL: ${v.productUrl}
Category: ${v.category}
Tagline: ${tagline}
Short description:
${v.productName} is a focused tool for ${v.audience}. It solves this problem: ${v.pain}. The output is ${v.outcome}. Offer: ${v.offer}.

Long description:
${v.productName} is intentionally narrow. It is built for people who already know the problem and want a fast, practical workflow instead of a large platform. Use it to move from "${v.pain}" to "${v.outcome}" with a simple first step.

Notes:
${v.notes}`;

  fields.makerOutput.textContent = `Hi, I built ${v.productName} for ${v.audience}.

The problem is simple: ${v.pain}.

The product focuses on one outcome: ${v.outcome}.

I would love feedback on:
1. Is the positioning clear in the first 5 seconds?
2. Which directory or community would be the best first channel?
3. What would make you trust the tool enough to try it?

Try it here: ${v.productUrl}`;

  fields.socialOutput.textContent = `Post 1:
I built ${v.productName} for ${v.audience}. It helps with ${v.outcome}. ${v.productUrl}

Post 2:
Before: ${v.pain}.
After: ${v.outcome}.
Tool: ${v.productName} - ${v.productUrl}

Post 3:
Small tools work best when they do one job clearly. ${v.productName} is for ${v.audience}: ${v.productUrl}`;

  const handoffReady = v.assetOwner !== "not assigned" && v.accountOwner !== "not assigned";
  fields.checklistOutput.textContent = `Submission handoff:
- Asset owner: ${v.assetOwner}
- Account and final-submit owner: ${v.accountOwner}
- Readiness: ${handoffReady ? "owners assigned; keep login and final submission authorization-gated" : "not ready; assign both owners before paid submission work"}

Directory checklist:
${directories.map((name, index) => `${index + 1}. ${name}: prepare URL, tagline, short description, screenshots, maker note, category, tags.`).join("\n")}

Do before submitting:
- Verify the product URL loads.
- Prepare 2-4 screenshots.
- Keep tagline under 60 characters when possible.
- Do not pay for placement without approval.
- Do not submit through logged-in accounts without authorization.
- Track status: draft, submitted, pending, approved, rejected, needs login.`;
}

function packText() {
  return `LaunchListAI pack

Directory listing:
${fields.listingOutput.textContent}

Maker comment:
${fields.makerOutput.textContent}

Social posts:
${fields.socialOutput.textContent}

Checklist:
${fields.checklistOutput.textContent}`;
}

function paidPackText() {
  const v = values();
  return `${packText()}

Paid handoff checklist:
1. Verify homepage, pricing, support, privacy, terms, sitemap, and canonical product URL before public traffic.
2. Prepare approved screenshots, gallery image order, demo notes, logo files, and alt text from real product states only.
3. Review category fit, duplicate listing risk, login requirements, captcha, paid placement prompts, and platform rules before each submission.
4. Keep Product Hunt, BetaList, Microlaunch, AlternativeTo, Toolify, Reddit, email, DM, paid placement, and public reply actions authorization-gated.
5. Track every channel as draft, needs assets, needs login, blocked by captcha, paid option, submitted, pending, approved, rejected, or needs owner reply.
6. Recheck pricing, refunds, discounts, support scope, testimonials, founder disclosure, and comparison claims against the live source of truth.
7. Save rejection reasons, editor feedback, user questions, and support issues without exposing private customer, payment, account, or credential data.

Channel tracker:
Product: ${v.productName}
URL: ${v.productUrl}
Offer: ${v.offer}
Audience: ${v.audience}
Asset owner: ${v.assetOwner}
Account and final-submit owner: ${v.accountOwner}

Channel | Asset owner | Login owner | Status | Blocker | Last checked | Next authorized step
Product Hunt | ${v.assetOwner} | ${v.accountOwner} | draft | _____ | _____ | _____
BetaList | ${v.assetOwner} | ${v.accountOwner} | draft | _____ | _____ | _____
Microlaunch | ${v.assetOwner} | ${v.accountOwner} | draft | _____ | _____ | _____
AlternativeTo | ${v.assetOwner} | ${v.accountOwner} | draft | _____ | _____ | _____
ThereIsAnAIForThat | ${v.assetOwner} | ${v.accountOwner} | draft | _____ | _____ | _____
Toolify | ${v.assetOwner} | ${v.accountOwner} | draft | _____ | _____ | _____
Relevant Reddit community | ${v.assetOwner} | ${v.accountOwner} | draft | _____ | _____ | _____
Newsletter or email list | ${v.assetOwner} | ${v.accountOwner} | draft | _____ | _____ | _____

Operating boundary:
LaunchListAI prepares browser-local drafts and planning files. It does not log into directories, bypass captcha, submit listings, publish posts, send emails or DMs, buy ads, create discounts, change payment links, edit accounts, or guarantee approval, ranking, traffic, sales, revenue, replies, or conversion results.`;
}

function setPaidPackActive(active, message) {
  paidPackActive = active;
  if (fields.downloadPaidPack) fields.downloadPaidPack.disabled = !active;
  if (fields.proStatus) fields.proStatus.textContent = message;
}

async function verifyPaidPackCode(rawCode, { quiet = false } = {}) {
  const code = rawCode.trim().toUpperCase();
  if (!/^LL-[A-F0-9]{4}(?:-[A-F0-9]{4}){3}$/.test(code)) {
    setPaidPackActive(
      false,
      quiet ? "Enter your code to unlock the Directory Submission Pack." : "That activation code format is not valid.",
    );
    return false;
  }
  if (fields.activatePack) fields.activatePack.disabled = true;
  if (!quiet) setPaidPackActive(false, "Checking activation code...");
  try {
    const response = await fetch(LICENSE_VERIFY_URL, {
      body: JSON.stringify({ code, product: "launchlistai" }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.valid !== true || result.entitlement !== "directory_submission_pack") {
      localStorage.removeItem(LICENSE_STORAGE_KEY);
      setPaidPackActive(false, "The code could not be verified. Check it or contact support.");
      return false;
    }
    localStorage.setItem(LICENSE_STORAGE_KEY, code);
    fields.proCode.value = code;
    setPaidPackActive(true, "Directory Submission Pack unlocked on this browser.");
    return true;
  } catch {
    setPaidPackActive(false, "Activation is temporarily unavailable. Your launch notes remain on this device.");
    return false;
  } finally {
    if (fields.activatePack) fields.activatePack.disabled = false;
  }
}

function downloadPaidPack() {
  if (!paidPackActive) {
    setPaidPackActive(false, "Activate the Directory Submission Pack before downloading.");
    fields.proCode?.focus();
    return;
  }
  const blob = new Blob([paidPackText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "launchlistai-directory-submission-pack.txt";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyAll() {
  await navigator.clipboard.writeText(packText());
  fields.copyAll.textContent = "Copied";
  setTimeout(() => {
    fields.copyAll.textContent = "Copy";
  }, 1400);
}

function emailPack() {
  const v = values();
  const subject = `LaunchListAI pack - ${v.productName}`;
  location.href = `mailto:support@pagecheckai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(packText())}`;
}

document.querySelector("#launchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  generate();
});
document.querySelector("#launchForm").addEventListener("input", generate);
document.querySelector("#launchForm").addEventListener("change", generate);

fields.copyAll.addEventListener("click", copyAll);
fields.emailPack.addEventListener("click", emailPack);
fields.activatePack?.addEventListener("click", () => verifyPaidPackCode(fields.proCode.value));
fields.downloadPaidPack?.addEventListener("click", downloadPaidPack);

const savedCode = localStorage.getItem(LICENSE_STORAGE_KEY);
if (savedCode && fields.proCode) {
  fields.proCode.value = savedCode;
  verifyPaidPackCode(savedCode, { quiet: true });
}

generate();
