const fields = {
  audience: document.querySelector("#audience"),
  category: document.querySelector("#category"),
  checklistOutput: document.querySelector("#checklistOutput"),
  copyAll: document.querySelector("#copyAll"),
  emailPack: document.querySelector("#emailPack"),
  listingOutput: document.querySelector("#listingOutput"),
  makerOutput: document.querySelector("#makerOutput"),
  notes: document.querySelector("#notes"),
  offer: document.querySelector("#offer"),
  outcome: document.querySelector("#outcome"),
  pain: document.querySelector("#pain"),
  productName: document.querySelector("#productName"),
  productUrl: document.querySelector("#productUrl"),
  socialOutput: document.querySelector("#socialOutput"),
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
    audience: value(fields.audience, "busy operators"),
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

  fields.checklistOutput.textContent = `Directory checklist:
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

fields.copyAll.addEventListener("click", copyAll);
fields.emailPack.addEventListener("click", emailPack);

generate();
