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
  {
    slug: "microlaunch-submission-checklist",
    title: "Microlaunch Submission Checklist",
    description: "Prepare Microlaunch-style product facts, launch copy, screenshots, pricing, maker notes, and account-only submission steps.",
    audience: "makers preparing a focused software or AI product for Microlaunch and similar launch communities",
    assets: ["Product summary", "Launch copy fields", "Screenshot checklist", "Submission and follow-up notes"],
    steps: ["Check current platform rules.", "Prepare product facts and assets.", "Review every claim.", "Submit after account authorization."],
    priority: [
      "Confirm that the product category and launch stage fit the platform before preparing a listing.",
      "Use the same canonical name, URL, pricing, and support details as the product site.",
      "Prepare a useful maker note and reply drafts before the listing becomes public.",
    ],
    proofAssets: [
      "Live product and support URLs",
      "Actual workflow screenshots",
      "Current pricing or free-first path",
      "Short maker note and honest product limitations",
    ],
    safety: [
      "Check current platform rules instead of assuming old field requirements still apply.",
      "Do not automate login, captcha, payment, public submission, or replies.",
      "Do not invent votes, users, reviews, rankings, or launch results.",
    ],
    faq: [["Does this submit to Microlaunch?", "No. It prepares a reviewed field pack; account and public actions require authorization."], ["Can the fields change?", "Yes. Confirm the current form and rules before submission."]],
  },
  {
    slug: "saas-launch-announcement-email",
    title: "SaaS Launch Announcement Email",
    description: "Draft a concise SaaS launch announcement email with audience fit, problem context, product proof, pricing, call to action, and opt-out language.",
    audience: "founders preparing a small, relevant launch email to customers, waitlist members, or opted-in contacts",
    assets: ["Subject line options", "Plain-text launch email", "Short follow-up", "Opt-out and audience-fit check"],
    steps: ["Choose a permission-based audience.", "Add product facts and proof.", "Generate the draft.", "Review recipients and authorize sending separately."],
    priority: [
      "Send only to people who reasonably expect product updates or have a strong relevant relationship.",
      "Lead with the user problem and concrete workflow rather than broad AI claims.",
      "Keep one clear call to action and a simple way to stop future messages.",
    ],
    proofAssets: [
      "Live product and support URL",
      "Specific workflow or result",
      "Current pricing and access status",
      "Sender identity and opt-out wording",
    ],
    safety: [
      "Do not buy lists, scrape private addresses, or send indiscriminate bulk email.",
      "Keep sending low-volume, relevant, personalized, and compliant with applicable rules.",
      "Final recipient selection and sending require authorization; stop on bounce or complaint anomalies.",
    ],
    faq: [["Will LaunchListAI send the email?", "No. It prepares drafts and a review checklist; sending requires a connected account and authorization."], ["Can it draft a follow-up?", "Yes. Keep it brief, relevant, and easy to opt out of."]],
  },
  {
    slug: "product-launch-press-kit-checklist",
    title: "Product Launch Press Kit Checklist",
    description: "Prepare a lean product launch press kit with company facts, product description, founder bio, screenshots, logo files, pricing, links, and contact details.",
    audience: "small teams sharing consistent launch assets with directories, newsletters, journalists, and community editors",
    assets: ["Press kit inventory", "Short product fact sheet", "Logo and screenshot notes", "Founder and contact copy"],
    steps: ["Gather canonical facts.", "Organize visual assets.", "Draft the fact sheet.", "Review rights, claims, and contact details before sharing."],
    priority: [
      "Keep one canonical fact sheet so product facts do not drift across submissions.",
      "Use downloadable assets that show the actual product and have clear usage permission.",
      "Make pricing, availability, founder identity, and contact details easy to verify.",
    ],
    proofAssets: [
      "Logo and favicon files",
      "Three to five product screenshots",
      "Short and long product descriptions",
      "Founder bio, support contact, pricing, and canonical links",
    ],
    safety: [
      "Do not include private customer data or unlicensed media.",
      "Do not claim press coverage, partnerships, traction, or awards that cannot be verified.",
      "Review every shared file for secrets, test accounts, and outdated pricing.",
    ],
    faq: [["Does a small product need a press kit?", "A lean fact sheet and organized asset folder can reduce repeated work even without formal press outreach."], ["Should customer logos be included?", "Only with clear permission."]],
  },
  {
    slug: "startup-launch-timeline-template",
    title: "Startup Launch Timeline Template",
    description: "Build a practical startup launch timeline covering site readiness, payment, support, screenshots, listings, social drafts, launch day, and follow-up.",
    audience: "solo founders and small teams coordinating a launch without a large marketing operation",
    assets: ["Four-week timeline", "Dependency checklist", "Launch-day schedule", "Post-launch follow-up queue"],
    steps: ["Set the target date.", "Map required assets and dependencies.", "Assign owners.", "Move blocked public actions into the authorization queue."],
    priority: [
      "Finish website, payment, support, policy, and tracking checks before public promotion.",
      "Prepare reusable launch assets before opening multiple directory forms.",
      "Reserve time after launch for support, replies, directory follow-up, and product fixes.",
    ],
    proofAssets: [
      "Live site and fallback URL",
      "Working payment and support paths",
      "Approved screenshots and listing copy",
      "Launch owner, schedule, and follow-up tracker",
    ],
    safety: [
      "Do not schedule public posts or submissions before the product and support path are ready.",
      "Do not promise launch rankings, revenue, or approval dates.",
      "Keep login, captcha, payment, and public posting steps explicitly authorized.",
    ],
    faq: [["How long should launch prep take?", "Use the shortest timeline that still leaves time for site, asset, payment, support, and claim review."], ["Can the timeline include multiple directories?", "Yes. Rank them by relevance and spread submissions so follow-up stays manageable."]],
  },
  {
    slug: "product-tagline-generator",
    title: "Product Tagline Generator",
    description: "Draft concise product taglines for directories and launch pages using one audience, one painful workflow, and one believable outcome.",
    audience: "makers who need consistent, platform-ready taglines without vague AI marketing language",
    assets: ["Short tagline options", "Audience-led variants", "Outcome-led variants", "Claim review checklist"],
    steps: ["Define the user and workflow.", "Add the real product outcome.", "Generate concise options.", "Check every claim against the live product."],
    priority: [
      "Name a specific audience or workflow before adding broad product category words.",
      "Prefer a concrete action or outcome over empty adjectives.",
      "Keep canonical wording consistent while adapting character length for each platform.",
    ],
    proofAssets: [
      "Product category",
      "Specific target user",
      "Live workflow and outcome",
      "Platform character limits",
    ],
    safety: [
      "Do not use best, guaranteed, number one, or fastest without reliable proof.",
      "Do not imply features or automation that the live product does not have.",
      "Review generated taglines before public use.",
    ],
    faq: [["What makes a useful tagline?", "A clear user, workflow, or outcome that a visitor can understand quickly."], ["Can one tagline fit every directory?", "Keep a canonical version, then shorten or clarify it for each platform."]],
  },
  {
    slug: "directory-listing-description-generator",
    title: "Directory Listing Description Generator",
    description: "Create short, medium, and editorial product descriptions for startup and AI directories with consistent facts, pricing, audience, and boundaries.",
    audience: "operators filling repeated directory description fields for a live SaaS, AI tool, template, or service",
    assets: ["One-sentence description", "Short directory description", "Long editorial description", "Fact consistency checklist"],
    steps: ["Enter canonical product facts.", "Generate length variants.", "Customize the category context.", "Review before each submission."],
    priority: [
      "Keep product name, URL, audience, pricing, and core workflow consistent across every listing.",
      "Adjust the opening sentence to the directory audience without changing the underlying facts.",
      "Use the longer description to explain proof, privacy, limitations, and support.",
    ],
    proofAssets: [
      "Canonical product facts",
      "Pricing and access status",
      "Specific workflow example",
      "Support and policy URLs",
    ],
    safety: [
      "Do not insert unsupported customer counts, ratings, savings, or performance claims.",
      "Do not keyword-stuff or submit duplicated descriptions to unrelated categories.",
      "Final public submission remains an authorized action.",
    ],
    faq: [["Why create multiple lengths?", "Directories use different field limits, so reviewed variants reduce rushed rewriting."], ["Can descriptions be reused?", "Yes. Customize context while keeping facts consistent."]],
  },
  {
    slug: "product-launch-faq-template",
    title: "Product Launch FAQ Template",
    description: "Prepare a product launch FAQ covering who the tool serves, what it does, pricing, privacy, limitations, support, refunds, and current access.",
    audience: "makers reducing repeated launch-day questions across product pages, directories, and community replies",
    assets: ["Core launch FAQ", "Pricing and access answers", "Privacy and limitation answers", "Support escalation notes"],
    steps: ["Collect real customer questions.", "Draft concise factual answers.", "Link to support and policies.", "Approve answers before publishing or replying."],
    priority: [
      "Answer the buyer questions that block trial or purchase first.",
      "Keep pricing, access, refund, privacy, and support answers aligned with the live site.",
      "Turn repeated launch questions into maintained product documentation.",
    ],
    proofAssets: [
      "Current product scope",
      "Pricing and payment path",
      "Privacy, terms, and support pages",
      "Known limitations and manual steps",
    ],
    safety: [
      "Do not invent refund, guarantee, privacy, or support policies.",
      "Do not hide important limitations behind vague answers.",
      "Public FAQ changes and replies require review against the current product.",
    ],
    faq: [["Where should the FAQ live?", "Use the product site as the source of truth and adapt short answers for directories."], ["Can it include refund details?", "Only if the answer matches the actual current policy."]],
  },
  {
    slug: "launch-asset-folder-checklist",
    title: "Launch Asset Folder Checklist",
    description: "Organize logos, icons, screenshots, demo clips, copy, pricing, support links, policy links, and platform exports in one launch asset folder.",
    audience: "makers preparing repeatable launch and directory submissions without searching through scattered files",
    assets: ["Folder structure", "Asset naming rules", "Current-version checklist", "Privacy and rights review"],
    steps: ["Create a canonical asset folder.", "Name files consistently.", "Archive outdated exports.", "Review every asset before upload."],
    priority: [
      "Separate source files, approved exports, and platform-specific versions.",
      "Keep current copy, pricing, URLs, and screenshots together with revision dates.",
      "Add a simple manifest so another operator can find the approved asset quickly.",
    ],
    proofAssets: [
      "Logo, icon, and favicon",
      "Desktop and mobile screenshots",
      "Short and long copy",
      "Pricing, support, privacy, terms, and contact links",
    ],
    safety: [
      "Remove secrets, personal data, test credentials, and private customer details.",
      "Use only media and logos you have permission to distribute.",
      "Do not upload outdated or unapproved assets to public platforms.",
    ],
    faq: [["What belongs in the canonical folder?", "Approved visuals, copy, links, and a manifest that identifies the current version."], ["Should source design files be public?", "No. Share only the exports needed for the destination."]],
  },
  {
    slug: "directory-rejection-follow-up-checklist",
    title: "Directory Rejection Follow-Up Checklist",
    description: "Turn a rejected or returned directory listing into a careful follow-up plan with reason tracking, asset fixes, claim cleanup, and one appropriate resubmission decision.",
    audience: "makers responding to editorial rejection without repeated spam submissions",
    assets: ["Rejection reason log", "Fix checklist", "Editor-response draft", "Resubmission decision"],
    steps: ["Save the exact rejection message.", "Identify factual or asset gaps.", "Fix the product or listing.", "Resubmit only when platform rules allow."],
    priority: [
      "Treat the rejection message as evidence instead of guessing why the listing failed.",
      "Fix the smallest real issue in product readiness, category fit, claims, or missing assets.",
      "Respect review queues and avoid repeated submissions when the product is not a fit.",
    ],
    proofAssets: [
      "Exact rejection or return message",
      "Original submitted copy",
      "Updated assets or product changes",
      "Platform resubmission rule",
    ],
    safety: [
      "Do not harass editors, evade bans, create duplicate accounts, or repeatedly resubmit unchanged listings.",
      "Do not pay for placement automatically after a free rejection.",
      "Escalate account warnings, paid options, and final resubmission for authorization.",
    ],
    faq: [["Should every rejection be resubmitted?", "No. Resubmit only after a real fix and when the platform rules and audience fit support it."], ["Can I ask an editor for details?", "Use one concise, respectful question when the platform permits it."]],
  },
  {
    slug: "product-launch-metrics-tracker",
    title: "Product Launch Metrics Tracker",
    description: "Track verified launch traffic, referrals, signups, purchases, support questions, directory status, and follow-up actions without inventing attribution.",
    audience: "small product teams measuring launch activity across owned pages, directories, and communities",
    assets: ["Daily metrics table", "Referral and listing log", "Question and objection notes", "Follow-up decision queue"],
    steps: ["Choose a small set of verified metrics.", "Record source and time window.", "Separate observed data from assumptions.", "Use results to prioritize fixes and follow-up."],
    priority: [
      "Track site health, referral traffic, conversion events, and support questions before vanity metrics.",
      "Keep launch-platform numbers separate from site analytics and payment records.",
      "Turn repeated objections and high-intent pages into product, FAQ, or SEO improvements.",
    ],
    proofAssets: [
      "Analytics source and reporting window",
      "Verified payment or signup events",
      "Directory listing and launch URLs",
      "Support questions and product-change notes",
    ],
    safety: [
      "Do not claim attribution, revenue, rankings, or conversion lifts that the data cannot support.",
      "Do not expose customer identities or sensitive payment information in shared reports.",
      "Treat missing tracking as unknown rather than estimating results.",
    ],
    faq: [["Which launch metrics matter first?", "Working site and payment paths, relevant traffic, real conversions, and repeated user questions."], ["Can directory traffic be attributed perfectly?", "Often not. Record the available source data and keep uncertainty explicit."]],
  },
  {
    slug: "product-hunt-gallery-checklist",
    title: "Product Hunt Gallery Checklist",
    description: "Plan Product Hunt gallery images with workflow screenshots, captions, dimensions, pricing clarity, and claim review before upload.",
    audience: "makers preparing Product Hunt gallery assets without confusing marketing mockups with real product proof",
    assets: ["Gallery shot list", "Caption prompts", "Dimension checklist", "Private data review"],
    steps: ["Pick real workflow screens.", "Order images by user story.", "Write short captions.", "Review claims and private data before upload."],
    priority: [
      "Show the actual product workflow before decorative brand images.",
      "Use captions to explain the user problem, input, output, and next action.",
      "Keep pricing, support, and privacy proof available if reviewers or users ask.",
    ],
    proofAssets: [
      "Desktop and mobile screenshots",
      "Output or result proof",
      "Logo and icon exports",
      "Current pricing and support links",
    ],
    safety: [
      "Do not upload fake UI states, customer data, secrets, or unlicensed media.",
      "Do not imply awards, rankings, users, or results that are not verified.",
      "Final Product Hunt upload requires account authorization.",
    ],
    faq: [["How many gallery images should I prepare?", "Prepare three to five real workflow images before adding optional brand assets."], ["Can generated mockups be used?", "Only if they accurately represent the live product and are reviewed before upload."]],
  },
  {
    slug: "launch-reply-moderation-queue",
    title: "Launch Reply Moderation Queue",
    description: "Prepare a launch reply queue for Product Hunt, Reddit, Indie Hackers, LinkedIn, and directory comments with disclosure and approval steps.",
    audience: "founders who need useful launch replies without rushing public comments during launch day",
    assets: ["Reply categories", "Approved answer bank", "Founder disclosure line", "Escalation queue"],
    steps: ["Group expected questions.", "Draft short helpful replies.", "Mark sensitive answers.", "Approve every public reply before posting."],
    priority: [
      "Answer real product questions first: pricing, privacy, workflow, limitations, and support.",
      "Use a clear founder or maker disclosure when replying in communities.",
      "Escalate legal, safety, refund, account-risk, or private-data questions instead of improvising.",
    ],
    proofAssets: [
      "Current FAQ and support policy",
      "Pricing and refund wording",
      "Known limitations",
      "Platform rule notes",
    ],
    safety: [
      "Do not post public replies without authorization.",
      "Do not argue, astroturf, impersonate users, or use fake testimonials.",
      "Stop on platform warnings, rate limits, captcha, or account-risk prompts.",
    ],
    faq: [["Can replies be prepared in advance?", "Yes. Drafts help, but public posting should still be approved."], ["Should every comment mention the product?", "No. Helpfulness and disclosure matter more than repeating the link."]],
  },
  {
    slug: "launch-pricing-disclosure-checklist",
    title: "Launch Pricing Disclosure Checklist",
    description: "Prepare clear pricing, free-first notes, refund boundaries, support expectations, and paid upsell wording for launch pages and directories.",
    audience: "makers who need pricing copy that stays consistent across product sites, directories, and launch communities",
    assets: ["Pricing statement", "Free vs paid scope", "Refund and support notes", "Directory field variants"],
    steps: ["Collect current offer details.", "Write the plain pricing answer.", "Create short directory variants.", "Review against the live checkout path."],
    priority: [
      "State what is free, what is paid, and what the buyer receives.",
      "Keep checkout links, support expectations, and refund wording aligned with the live site.",
      "Avoid hiding manual service steps behind vague AI automation language.",
    ],
    proofAssets: [
      "Live payment URL",
      "Support page",
      "Offer deliverables",
      "Refund or cancellation policy",
    ],
    safety: [
      "Do not invent refunds, guarantees, discounts, or subscription terms.",
      "Do not claim a payment path is live until it has been verified.",
      "Paid placements and checkout changes require authorization.",
    ],
    faq: [["Should pricing be shown in directory listings?", "Use transparent pricing when the directory asks or when it reduces buyer confusion."], ["Can a free tool still mention a paid service?", "Yes, if the free and paid scopes are clearly separated."]],
  },
  {
    slug: "founder-bio-for-launch-profile",
    title: "Founder Bio for Launch Profile",
    description: "Draft a short founder bio for launch profiles with credible context, product motivation, contact route, and no fake traction claims.",
    audience: "solo founders and makers preparing profile copy for launch platforms, directories, and community posts",
    assets: ["Short founder bio", "Maker motivation", "Contact line", "Claim review checklist"],
    steps: ["Add real founder context.", "Explain why the product exists.", "Generate profile variants.", "Review every claim before publishing."],
    priority: [
      "Connect the founder story to the user problem rather than broad self-promotion.",
      "Keep experience claims specific and verifiable.",
      "Use one support or contact route so interested users know where to go.",
    ],
    proofAssets: [
      "Founder name or maker handle",
      "Relevant product context",
      "Support or contact URL",
      "Approved profile photo or logo",
    ],
    safety: [
      "Do not invent credentials, employers, funding, customers, press, or awards.",
      "Do not expose private personal details that are not intended for public launch profiles.",
      "Review profile changes before public posting.",
    ],
    faq: [["Does a founder bio need to be long?", "No. A short credible explanation is usually better for launch profiles."], ["Can it mention health or personal circumstances?", "Only if the founder intentionally wants that public and has reviewed the wording."]],
  },
  {
    slug: "no-code-product-launch-checklist",
    title: "No-Code Product Launch Checklist",
    description: "Prepare a no-code product launch with custom domain, payment link, support page, privacy pages, screenshots, and directory-safe copy.",
    audience: "operators launching a no-code, static, or service-assisted product with limited engineering overhead",
    assets: ["Launch readiness checklist", "Trust page list", "Payment and support checks", "Directory copy notes"],
    steps: ["Verify the live site.", "Check payment and support.", "Prepare screenshots.", "Generate launch copy after readiness checks."],
    priority: [
      "Confirm domain, SSL, homepage, support, privacy, terms, sitemap, and payment before promotion.",
      "Make the no-code or service-assisted scope clear so users know what happens after purchase.",
      "Use launch copy that matches what the product can actually do today.",
    ],
    proofAssets: [
      "Custom domain and fallback URL",
      "Payment link",
      "Support, privacy, and terms pages",
      "Screenshot set and product scope",
    ],
    safety: [
      "Do not claim full automation when the workflow includes manual review or delivery.",
      "Do not launch paid traffic before payment and support are verified.",
      "Final public submissions and paid listings require authorization.",
    ],
    faq: [["Can a no-code product be launched publicly?", "Yes, if the live workflow, support path, and paid scope are honest."], ["What should be checked first?", "Domain, payment, support, privacy, terms, and the actual user workflow."]],
  },
  {
    slug: "ai-tool-launch-keyword-map",
    title: "AI Tool Launch Keyword Map",
    description: "Create an AI tool launch keyword map for directories, SEO pages, social posts, and outreach using user problems instead of keyword stuffing.",
    audience: "AI tool makers choosing launch keywords for directory tags, page titles, and promotion drafts",
    assets: ["Keyword clusters", "Directory tag ideas", "SEO page prompts", "Claim and fit review"],
    steps: ["List target users.", "Map painful workflows.", "Generate keyword clusters.", "Choose the safest high-fit terms for each channel."],
    priority: [
      "Start from user tasks and objections instead of generic AI buzzwords.",
      "Separate directory tags, SEO titles, social hooks, and support FAQ wording.",
      "Use launch feedback to refine keywords after real questions appear.",
    ],
    proofAssets: [
      "Target audience",
      "Product category",
      "Current features and limitations",
      "Existing SEO or directory pages",
    ],
    safety: [
      "Do not keyword-stuff unrelated categories.",
      "Do not use competitor names or trademarked terms in misleading ways.",
      "Do not imply regulated, medical, legal, financial, or compliance outcomes unless truly supported.",
    ],
    faq: [["Should launch keywords be broad?", "Start narrow. High-fit workflow terms are easier to defend and convert."], ["Can keywords become SEO pages?", "Yes, after checking that the page can offer genuinely useful content."]],
  },
  {
    slug: "localized-launch-listing-checklist",
    title: "Localized Launch Listing Checklist",
    description: "Prepare localized launch listing copy with translated value props, regional pricing notes, support expectations, and cultural claim review.",
    audience: "makers adapting launch copy for another language, region, or directory audience",
    assets: ["Localized tagline", "Regional description", "Pricing and support notes", "Translation review checklist"],
    steps: ["Choose the target region.", "Adapt the user problem.", "Generate localized copy.", "Have a fluent reviewer check meaning before posting."],
    priority: [
      "Translate the user problem and workflow, not just individual words.",
      "Keep pricing, delivery, support hours, and payment options clear for the target audience.",
      "Review idioms, claims, and sensitive wording before public use.",
    ],
    proofAssets: [
      "Source-language canonical facts",
      "Target language and region",
      "Pricing and support availability",
      "Localized screenshots if needed",
    ],
    safety: [
      "Do not publish machine translation without review when meaning or claims matter.",
      "Do not imply local support, tax handling, or legal compliance that is not actually available.",
      "Final localized posting requires authorization.",
    ],
    faq: [["Is direct translation enough?", "Usually no. Directory copy should adapt to the local user's workflow and expectations."], ["Should prices be localized?", "Only when the checkout and support process truly support that market."]],
  },
  {
    slug: "newsletter-launch-pitch-checklist",
    title: "Newsletter Launch Pitch Checklist",
    description: "Prepare a concise newsletter pitch with audience fit, product proof, screenshots, founder note, and a respectful one-email outreach boundary.",
    audience: "makers pitching a relevant product to curated newsletters, deal roundups, or niche founder lists",
    assets: ["Newsletter pitch", "Subject line options", "Proof links", "Follow-up boundary"],
    steps: ["Choose only high-fit newsletters.", "Draft a short pitch.", "Attach proof links.", "Send only after recipient and wording approval."],
    priority: [
      "Pitch newsletters whose readers match the product's specific buyer or user.",
      "Lead with why the product is useful to that audience, not why the maker wants coverage.",
      "Use one respectful follow-up only when the publication permits it.",
    ],
    proofAssets: [
      "Live product URL",
      "Short product proof",
      "Screenshots or demo link",
      "Founder contact and support URL",
    ],
    safety: [
      "Do not scrape private email lists or send indiscriminate bulk pitches.",
      "Do not attach large files or private customer data.",
      "Final sending requires authorization and must stop on bounce or complaint anomalies.",
    ],
    faq: [["Should every newsletter be pitched?", "No. Use only high-fit publications with a relevant audience."], ["Can this draft follow-ups?", "Yes, but keep follow-ups low-frequency and easy to stop."]],
  },
  {
    slug: "affiliate-referral-launch-disclosure",
    title: "Affiliate Referral Launch Disclosure",
    description: "Prepare affiliate or referral launch wording with transparent incentives, creator disclosure, tracking notes, and no deceptive endorsement claims.",
    audience: "makers using affiliate links, referral rewards, or partner mentions during a product launch",
    assets: ["Disclosure line", "Partner mention copy", "Tracking notes", "Approval checklist"],
    steps: ["Identify any incentive.", "Write clear disclosure wording.", "Separate paid and unpaid mentions.", "Review before public posting or sending."],
    priority: [
      "State when a link, post, review, or mention includes an incentive.",
      "Keep referral copy separate from independent user feedback or editorial claims.",
      "Track partner links so launch metrics do not mix paid, owned, and organic channels.",
    ],
    proofAssets: [
      "Referral or affiliate terms",
      "Partner relationship notes",
      "Approved disclosure wording",
      "Tracking URLs and destination pages",
    ],
    safety: [
      "Do not hide sponsorship, referral rewards, or affiliate incentives.",
      "Do not imply independent endorsement when compensation or referral value exists.",
      "Review applicable platform and legal disclosure rules before posting.",
    ],
    faq: [["Do small referral rewards need disclosure?", "Use transparent disclosure when an incentive could affect how readers interpret the mention."], ["Can affiliate copy be automated?", "Drafts can be prepared, but final disclosure and posting need review."]],
  },
  {
    slug: "launch-support-inbox-triage",
    title: "Launch Support Inbox Triage",
    description: "Prepare launch support inbox triage for pricing questions, refunds, bugs, feature requests, payment issues, and high-risk messages.",
    audience: "small teams handling support questions after public launch traffic starts",
    assets: ["Support categories", "Reply draft bank", "Escalation rules", "Daily support summary"],
    steps: ["List expected question types.", "Draft safe replies.", "Mark sensitive categories.", "Escalate payment, refund, legal, safety, or account-risk cases."],
    priority: [
      "Answer pricing, access, and workflow questions quickly with current product facts.",
      "Separate bugs, refunds, payment issues, and sensitive complaints from general launch feedback.",
      "Turn repeated questions into FAQ, directory copy, and product fixes.",
    ],
    proofAssets: [
      "Support email or form",
      "Current pricing and refund policy",
      "Known bugs or limitations",
      "Escalation contact or owner",
    ],
    safety: [
      "Do not promise refunds, legal remedies, delivery timelines, or account actions that are not policy-approved.",
      "Do not expose customer identities or payment details in launch summaries.",
      "Sensitive replies and account changes require authorization.",
    ],
    faq: [["What support questions matter most on launch day?", "Payment, access, privacy, workflow confusion, and bugs that block purchase or use."], ["Can replies be drafted automatically?", "Yes. Sending and sensitive decisions still require review."]],
  },
  {
    slug: "product-hunt-first-comment-template",
    title: "Product Hunt First Comment Template",
    description: "Draft a Product Hunt first comment with maker context, product scope, pricing, limitations, feedback prompts, and launch-day disclosure.",
    audience: "makers preparing the first public Product Hunt comment before launch day",
    assets: ["First comment draft", "Founder context", "Pricing and scope notes", "Feedback questions"],
    steps: ["Collect product facts.", "Draft the first comment.", "Review claims and pricing.", "Post only after account authorization."],
    priority: [
      "Open with why the product exists and who it helps.",
      "State what is live today, what is paid, and what remains manual.",
      "Ask for specific feedback instead of asking broadly for support.",
    ],
    proofAssets: [
      "Live product URL",
      "Current pricing and support path",
      "Known limitations",
      "Screenshots or demo link",
    ],
    safety: [
      "Do not invent maker history, traction, awards, customers, or launch results.",
      "Do not post the first comment without account owner approval.",
      "Avoid promises about ranking, votes, approval, traffic, sales, or future features.",
    ],
    faq: [["What should a first comment include?", "A short maker note, clear product scope, honest limitations, and a useful feedback ask."], ["Can it mention pricing?", "Yes, when it matches the live checkout and support pages."]],
  },
  {
    slug: "launch-demo-video-script",
    title: "Launch Demo Video Script",
    description: "Plan a short launch demo video script that shows the real workflow, user problem, input, output, pricing, and support path.",
    audience: "makers preparing demo clips for Product Hunt, directories, newsletters, or social launch posts",
    assets: ["Demo script", "Shot list", "Caption prompts", "Privacy review checklist"],
    steps: ["Pick the core workflow.", "Write a short voiceover.", "List required screens.", "Review private data and claims before recording."],
    priority: [
      "Show the actual product doing one valuable task before showing logos or slides.",
      "Keep the demo short enough for directory reviewers and launch visitors.",
      "Use captions for the problem, action, output, and next step.",
    ],
    proofAssets: [
      "Working product flow",
      "Clean demo account or sample data",
      "Output screen or result",
      "Pricing and support link",
    ],
    safety: [
      "Do not record private data, customer details, secrets, or real credentials.",
      "Do not fake UI states, integrations, or outcomes that the product cannot produce.",
      "Review the video before public upload or directory submission.",
    ],
    faq: [["How long should the launch demo be?", "A focused 30 to 90 second workflow demo is usually more useful than a broad product tour."], ["Should I use real customer data?", "No. Use sample data that cannot expose a customer or private account."]],
  },
  {
    slug: "directory-category-selection-checklist",
    title: "Directory Category Selection Checklist",
    description: "Choose directory categories and tags by product workflow, buyer intent, platform rules, and claim safety before submitting.",
    audience: "operators unsure which category to choose for AI directories, startup directories, and launch communities",
    assets: ["Category shortlist", "Tag map", "Fit score", "Misclassification risk notes"],
    steps: ["Describe the real workflow.", "Map possible categories.", "Check directory rules.", "Pick the highest-fit category before submission."],
    priority: [
      "Choose the category a buyer would use, not the broadest traffic category.",
      "Keep AI tags specific to the actual workflow and output.",
      "Document why each directory category was chosen so future updates stay consistent.",
    ],
    proofAssets: [
      "Product workflow summary",
      "Target buyer or user",
      "Current features and limitations",
      "Directory category rules",
    ],
    safety: [
      "Do not place a product in unrelated categories just to chase traffic.",
      "Do not imply regulated, legal, medical, financial, or compliance outcomes without support.",
      "Final category selection for public submission requires review.",
    ],
    faq: [["Should I pick multiple categories?", "Only when the directory supports them and each category honestly fits the product."], ["What if the perfect category is missing?", "Pick the closest truthful category and clarify the workflow in the description."]],
  },
  {
    slug: "launch-testimonial-request-template",
    title: "Launch Testimonial Request Template",
    description: "Draft a careful testimonial or feedback request for launch users without pressure, incentives confusion, or fake endorsement language.",
    audience: "makers asking early users for feedback, quotes, or permission after a launch",
    assets: ["Feedback request", "Quote permission wording", "Usage scope notes", "Follow-up boundary"],
    steps: ["Choose a real user relationship.", "Ask for specific feedback.", "Request quote permission separately.", "Record consent before publishing."],
    priority: [
      "Ask for product feedback first and public quote permission second.",
      "Make it easy to decline or request edits before publication.",
      "Store who approved the quote, where it can appear, and whether a name or company can be used.",
    ],
    proofAssets: [
      "Actual user interaction or purchase",
      "Feedback context",
      "Permission record",
      "Approved quote wording",
    ],
    safety: [
      "Do not fabricate testimonials, reviews, customer logos, or endorsements.",
      "Do not pressure users or hide incentives that might affect a quote.",
      "Do not publish names, companies, screenshots, or private details without permission.",
    ],
    faq: [["Can I ask for a testimonial right after launch?", "Yes, but keep the ask optional, specific, and separate from support pressure."], ["Can AI rewrite a quote?", "Only with review and permission so the final wording still reflects what the user approved."]],
  },
  {
    slug: "early-user-feedback-survey",
    title: "Early User Feedback Survey",
    description: "Create an early user feedback survey for launch visitors with activation questions, objections, pricing clarity, and privacy-safe fields.",
    audience: "founders collecting focused feedback after a product launch or directory listing",
    assets: ["Survey questions", "Objection categories", "Pricing clarity check", "Product improvement queue"],
    steps: ["Pick the feedback goal.", "Ask only necessary questions.", "Separate bugs from objections.", "Turn patterns into product fixes."],
    priority: [
      "Ask about the moment users understood or abandoned the product.",
      "Collect objections around pricing, trust, workflow, privacy, and missing features.",
      "Keep the survey short enough that real users can answer it.",
    ],
    proofAssets: [
      "Launch URL or traffic source",
      "Current product promise",
      "Support questions",
      "Known product limitations",
    ],
    safety: [
      "Do not collect sensitive personal data unless it is truly needed.",
      "Do not present survey responses as statistically representative without enough data.",
      "Do not publish user answers or identities without explicit permission.",
    ],
    faq: [["How many questions should the survey have?", "Use five to seven focused questions before asking for anything optional."], ["Can survey answers become testimonials?", "Only if the user separately approves public quote usage."]],
  },
  {
    slug: "appsumo-launch-listing-checklist",
    title: "AppSumo Launch Listing Checklist",
    description: "Prepare AppSumo-style launch listing assets, deal scope notes, support capacity, refund boundaries, screenshots, and paid placement review.",
    audience: "makers evaluating whether a software deal marketplace fits their product launch",
    assets: ["Deal readiness checklist", "Listing copy fields", "Support capacity notes", "Paid and account-action blockers"],
    steps: ["Check marketplace fit.", "Define the deal scope.", "Prepare listing assets.", "Escalate account, payment, or final submission decisions."],
    priority: [
      "Evaluate whether the product can handle deal traffic and support expectations before listing.",
      "Make lifetime, subscription, discount, refund, and support terms explicit if a deal exists.",
      "Compare marketplace fit against lower-risk directories before paying for exposure.",
    ],
    proofAssets: [
      "Product URL and support page",
      "Pricing and deal terms",
      "Refund or cancellation policy",
      "Support capacity and response expectations",
    ],
    safety: [
      "Do not create paid listings, discounts, coupons, or deal terms without authorization.",
      "Do not promise lifetime access, refunds, or support levels that are not approved.",
      "Stop on login, payment, contract, platform-risk, or account-setting prompts.",
    ],
    faq: [["Is AppSumo right for every launch?", "No. It can create support and pricing commitments, so fit and capacity need review first."], ["Can LaunchListAI submit the deal?", "No. It prepares a readiness pack; account, payment, and final listing actions require authorization."]],
  },
  {
    slug: "launch-roadmap-disclosure-template",
    title: "Launch Roadmap Disclosure Template",
    description: "Write launch roadmap disclosure copy that separates live features, planned improvements, known limitations, and non-promised ideas.",
    audience: "makers answering roadmap questions during launch without overpromising future features",
    assets: ["Live-now statement", "Near-term roadmap", "Known limitations", "Non-commitment wording"],
    steps: ["List what works today.", "Separate committed work from ideas.", "Write clear limitation notes.", "Review before public replies."],
    priority: [
      "Lead with live functionality before mentioning future ideas.",
      "Use planned or exploring language carefully so users do not read it as a promise.",
      "Connect roadmap items to repeated launch feedback rather than hype.",
    ],
    proofAssets: [
      "Current feature list",
      "Known bugs or limitations",
      "Support and feedback notes",
      "Approved public roadmap language",
    ],
    safety: [
      "Do not promise dates, integrations, compliance outcomes, or enterprise features unless approved.",
      "Do not hide material limitations that affect purchase or use.",
      "Sensitive roadmap, pricing, or account commitments require authorization.",
    ],
    faq: [["Should I share a roadmap on launch day?", "Share only enough to answer real questions and keep live functionality clear."], ["Can roadmap ideas be used in marketing?", "Only when the wording does not imply a guaranteed future feature."]],
  },
  {
    slug: "launch-bug-report-triage",
    title: "Launch Bug Report Triage",
    description: "Prepare a launch bug report triage workflow for broken links, checkout issues, mobile bugs, browser problems, and support escalation.",
    audience: "small teams handling launch-day bug reports without losing track of severity or user impact",
    assets: ["Bug intake fields", "Severity labels", "User reply drafts", "Fix and follow-up queue"],
    steps: ["Capture the exact issue.", "Classify severity.", "Reply with a safe next step.", "Record fix status and follow-up."],
    priority: [
      "Treat payment, signup, broken homepage, and privacy issues as higher priority than copy polish.",
      "Ask for only the minimum reproduction details needed to investigate.",
      "Use repeated bug reports to update FAQ, support copy, or product fixes.",
    ],
    proofAssets: [
      "Affected URL",
      "Browser and device notes",
      "Screenshot or error text without private data",
      "Current status and owner",
    ],
    safety: [
      "Do not ask users to send passwords, payment details, or sensitive files.",
      "Do not promise a fix time unless the owner has approved it.",
      "Account, refund, payment, or sensitive support decisions require authorization.",
    ],
    faq: [["What counts as urgent during launch?", "Broken checkout, inaccessible homepage, signup failure, security/privacy concerns, and widespread mobile breakage."], ["Can users send screenshots?", "Yes, but ask them to remove private data first."]],
  },
  {
    slug: "launch-refund-policy-faq",
    title: "Launch Refund Policy FAQ",
    description: "Draft launch refund and support FAQ copy that matches the real payment path, service scope, delivery expectations, and escalation rules.",
    audience: "makers preparing pricing and support answers before public launch traffic asks refund questions",
    assets: ["Refund FAQ", "Support scope notes", "Delivery expectation wording", "Escalation checklist"],
    steps: ["Collect current payment terms.", "Draft concise refund answers.", "Check support capacity.", "Approve before publishing or replying."],
    priority: [
      "Keep refund language aligned with the real checkout, terms page, and support policy.",
      "Separate self-serve tool usage from paid service deliverables.",
      "Prepare escalation notes for payment disputes, duplicate purchases, and unhappy users.",
    ],
    proofAssets: [
      "Payment link and receipt flow",
      "Terms and support pages",
      "Paid service deliverables",
      "Refund or cancellation owner",
    ],
    safety: [
      "Do not invent refund terms, guarantees, delivery windows, or chargeback advice.",
      "Do not publish sensitive payment details in support summaries.",
      "Refund decisions and account/payment actions require authorization.",
    ],
    faq: [["Should refund wording be public before launch?", "Yes, if it matches the real policy and helps buyers understand the offer."], ["Can AI decide refunds?", "No. It can draft support wording, but refund decisions require the responsible owner."]],
  },
  {
    slug: "launch-content-calendar-template",
    title: "Launch Content Calendar Template",
    description: "Plan a launch content calendar for prelaunch, launch day, post-launch recap, directory updates, support learnings, and low-risk follow-up.",
    audience: "makers spreading launch work across owned pages, directories, newsletters, and social channels",
    assets: ["Content calendar", "Channel cadence", "Draft queue", "Authorization checkpoints"],
    steps: ["Choose channels.", "Map prelaunch and post-launch dates.", "Draft useful posts.", "Approve every public or outbound action."],
    priority: [
      "Reuse real launch facts across channels while changing the angle for each audience.",
      "Mix product education, launch proof, FAQ answers, and follow-up notes instead of repeating the same announcement.",
      "Leave room for support findings and product fixes after launch traffic arrives.",
    ],
    proofAssets: [
      "Launch date and product URL",
      "Approved screenshots and copy",
      "Support and FAQ updates",
      "Directory and social status notes",
    ],
    safety: [
      "Do not schedule public posts that have not been reviewed.",
      "Do not send bulk outreach, paid ads, or private messages without authorization.",
      "Do not claim rankings, traffic, revenue, or user results without verified evidence.",
    ],
    faq: [["How often should I post during launch?", "Use a small cadence you can support with real updates and useful replies."], ["Can one post go everywhere?", "Keep facts consistent, but adapt wording and disclosure to each channel."]],
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
