const fields = {
  accountOwner: document.querySelector("#accountOwner"),
  activationFallbackLink: document.querySelector("#activationFallbackLink"),
  activationPaymentLink: document.querySelector("#activationPaymentLink"),
  audience: document.querySelector("#audience"),
  assetOwner: document.querySelector("#assetOwner"),
  category: document.querySelector("#category"),
  checklistOutput: document.querySelector("#checklistOutput"),
  activatePack: document.querySelector("#activatePack"),
  copyAll: document.querySelector("#copyAll"),
  downloadPaidPack: document.querySelector("#downloadPaidPack"),
  emailPack: document.querySelector("#emailPack"),
  listingOutput: document.querySelector("#listingOutput"),
  launchForm: document.querySelector("#launchForm"),
  makerOutput: document.querySelector("#makerOutput"),
  notes: document.querySelector("#notes"),
  offer: document.querySelector("#offer"),
  outcome: document.querySelector("#outcome"),
  pain: document.querySelector("#pain"),
  paymentLink: document.querySelector("#paymentLink"),
  proCode: document.querySelector("#proCode"),
  proStatus: document.querySelector("#proStatus"),
  productName: document.querySelector("#productName"),
  productUrl: document.querySelector("#productUrl"),
  screenshotCount: document.querySelector("#screenshotCount"),
  socialOutput: document.querySelector("#socialOutput"),
  targetChannels: document.querySelector("#targetChannels"),
};

const LICENSE_VERIFY_URL = "https://namebatch.pagecheckai.com/api/licenses/verify";
const LICENSE_STORAGE_KEY = "launchlistai-paid-code";
let paidPackActive = false;
let launchGenerated = false;
let launchQualified = false;

const paymentBaseLinks = {
  checkout: "https://namebatch.pagecheckai.com/api/checkout?v=launchlist-20260731&product=launchlistai",
  fallback: "https://www.paypal.com/ncp/payment/29SE33AHUSTRC",
};

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
    accountOwner: value(fields.accountOwner),
    audience: value(fields.audience),
    assetOwner: value(fields.assetOwner),
    category: fields.category.value,
    notes: value(fields.notes),
    offer: value(fields.offer),
    outcome: value(fields.outcome),
    pain: value(fields.pain),
    productName: value(fields.productName),
    productUrl: value(fields.productUrl),
    screenshotCount: Math.max(Number(fields.screenshotCount.value) || 0, 0),
    targetChannels: value(fields.targetChannels),
  };
}

function checkoutHref(content) {
  const url = new URL(paymentBaseLinks.checkout);
  const inbound = new URLSearchParams(location.search);
  url.searchParams.set("utm_source", "launchlistai");
  url.searchParams.set("utm_medium", "owned");
  url.searchParams.set("utm_campaign", "conversion");
  url.searchParams.set("utm_content", content);
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const inboundValue = inbound.get(key)?.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "").slice(0, 80);
    if (inboundValue) url.searchParams.set(key, inboundValue);
  }
  return url.toString();
}

function productUrlIsSafe() {
  const rawUrl = value(fields.productUrl);
  let safe = false;
  try {
    safe = ["http:", "https:"].includes(new URL(rawUrl).protocol);
  } catch {
    safe = false;
  }
  fields.productUrl.setCustomValidity(rawUrl && !safe ? "Use a public HTTP or HTTPS product URL." : "");
  return safe;
}

function qualificationIssues(v = values()) {
  const issues = [];
  if (!v.productName) issues.push("the product name");
  if (!v.productUrl || !productUrlIsSafe()) issues.push("a public HTTP or HTTPS product URL");
  if (!v.audience) issues.push("a specific audience");
  if (!v.pain) issues.push("the primary pain");
  if (!v.outcome) issues.push("the core outcome");
  if (!v.offer) issues.push("the current price or offer");
  if (!v.assetOwner) issues.push("an asset owner");
  if (!v.accountOwner) issues.push("an account and final-submit owner");
  if (v.screenshotCount < 2) issues.push("at least 2 approved screenshots");
  if (v.targetChannels.length < 10) issues.push("2-4 named target channels");
  if (v.notes.length < 80) issues.push("at least 80 characters of verified launch notes");
  return issues;
}

function syncDownloadButton() {
  fields.downloadPaidPack.disabled = !(paidPackActive && launchQualified);
}

function setPurchaseState(qualified) {
  launchQualified = qualified;
  fields.paymentLink.href = qualified ? checkoutHref("home_current_plan") : "#builder";
  fields.activationPaymentLink.href = qualified ? checkoutHref("activation_current_plan") : "#builder";
  fields.activationFallbackLink.href = qualified ? paymentBaseLinks.fallback : "#builder";
  fields.paymentLink.textContent = qualified
    ? "Pay $99 for this current launch plan"
    : "Complete the current launch plan first";
  fields.activationPaymentLink.textContent = qualified
    ? "Buy for $99 after fit"
    : "Generate a ready launch plan before buying";
  fields.copyAll.disabled = !qualified;
  fields.emailPack.disabled = !qualified;
  syncDownloadButton();
  if (paidPackActive) {
    fields.proStatus.textContent = qualified
      ? "Directory Submission Pack ready for this current launch plan."
      : "Activation verified. Generate a current ready launch plan before downloading.";
  }
}

function clearGenerated(message = "Complete the current product facts, proof assets, and owners, then generate a launch plan.") {
  fields.listingOutput.textContent = message;
  fields.makerOutput.textContent = "No current maker comment yet.";
  fields.socialOutput.textContent = "No current social drafts yet.";
  fields.checklistOutput.textContent = "No current submission checklist yet.";
}

function invalidateLaunch() {
  launchGenerated = false;
  setPurchaseState(false);
  clearGenerated("Launch inputs changed. Generate the current plan again before copying, emailing, paying, or downloading.");
}

function generate() {
  const v = values();
  const issues = qualificationIssues(v);
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
${v.notes}

Proof assets:
- Approved screenshots: ${v.screenshotCount}
- Target channels: ${v.targetChannels}`;

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

  fields.checklistOutput.textContent = `Submission handoff:
- Asset owner: ${v.assetOwner}
- Account and final-submit owner: ${v.accountOwner}
- Approved screenshots: ${v.screenshotCount}
- Target channels: ${v.targetChannels}
- Readiness: ${issues.length === 0 ? "current plan is reviewable; keep login and final submission authorization-gated" : `not ready - add ${issues.join(", ")}`}

Directory checklist:
${directories.map((name, index) => `${index + 1}. ${name}: prepare URL, tagline, short description, screenshots, maker note, category, tags.`).join("\n")}

Do before submitting:
- Verify the product URL loads.
- Prepare 2-4 screenshots.
- Keep tagline under 60 characters when possible.
- Do not pay for placement without approval.
- Do not submit through logged-in accounts without authorization.
- Track status: draft, submitted, pending, approved, rejected, needs login.`;
  return issues;
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
Approved screenshots: ${v.screenshotCount}
Target channels: ${v.targetChannels}

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
  syncDownloadButton();
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
    setPaidPackActive(
      true,
      launchQualified
        ? "Directory Submission Pack ready for this current launch plan."
        : "Activation verified. Generate a current ready launch plan before downloading.",
    );
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
  if (!launchGenerated || !launchQualified) {
    setPaidPackActive(true, "Generate a current ready launch plan before downloading the paid pack.");
    fields.launchForm.querySelector(":invalid")?.focus();
    return;
  }
  if (!fields.launchForm.reportValidity()) {
    setPaidPackActive(true, "Complete the current launch facts, proof assets, and owners before downloading the paid pack.");
    return;
  }
  try {
    const blob = new Blob([paidPackText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "launchlistai-directory-submission-pack.txt";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setPaidPackActive(true, "Paid directory pack download started. Wait for your browser to confirm the file.");
  } catch {
    setPaidPackActive(true, "Paid directory pack download could not start. Your current launch plan and activation are still available; try again.");
  }
}

async function copyAll() {
  if (!launchGenerated || !launchQualified) return;
  fields.copyAll.disabled = true;
  try {
    await navigator.clipboard.writeText(packText());
    fields.copyAll.textContent = "Copied";
  } catch {
    fields.copyAll.textContent = "Copy failed - retry";
  } finally {
    window.setTimeout(() => {
      fields.copyAll.textContent = "Copy";
      fields.copyAll.disabled = !launchQualified;
    }, 1400);
  }
}

function approvedInquiryText() {
  const v = values();
  const channelCount = v.targetChannels
    .split(/[\n,]/)
    .map((channel) => channel.trim())
    .filter(Boolean).length;
  return `LaunchListAI paid fit inquiry

Product: ${v.productName}
Public URL: ${v.productUrl}
Category: ${v.category}
Current offer: ${v.offer}
Approved screenshots: ${v.screenshotCount}
Target channel count: ${channelCount}
Readiness: A current launch plan is ready for owner review.

Privacy note: Audience research, pain and outcome notes, internal launch notes, owner identities or roles, generated listing copy, maker comments, social drafts, credentials, private assets, and the full pack are intentionally not included. Please reply with scope and pack-fit guidance before requesting any additional approved detail.`;
}

function emailPack() {
  if (!launchGenerated || !launchQualified || !fields.launchForm.reportValidity()) return;
  const subject = "LaunchListAI paid fit inquiry";
  location.href = `mailto:support@pagecheckai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(approvedInquiryText())}`;
}

fields.launchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const issues = generate();
  launchGenerated = true;
  setPurchaseState(issues.length === 0);
});
fields.launchForm.addEventListener("input", invalidateLaunch);
fields.launchForm.addEventListener("change", invalidateLaunch);

fields.copyAll.addEventListener("click", copyAll);
fields.emailPack.addEventListener("click", emailPack);
fields.activatePack?.addEventListener("click", () => verifyPaidPackCode(fields.proCode.value));
fields.downloadPaidPack?.addEventListener("click", downloadPaidPack);

const savedCode = localStorage.getItem(LICENSE_STORAGE_KEY);
if (savedCode && fields.proCode) {
  fields.proCode.value = savedCode;
  verifyPaidPackCode(savedCode, { quiet: true });
}

clearGenerated();
setPurchaseState(false);
