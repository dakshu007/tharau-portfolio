# Tharani Muthukumar | Portfolio

Personal portfolio of **Tharani Muthukumar**, Growth Marketer · B2B SaaS.

Live: https://dakshu007.github.io/tharau-portfolio/

## Stack

- **Astro** (static output, zero framework runtime) for perfect Core Web Vitals
- **Raw WebGL** shader for the animated hero background (~2 KB, loads after first interaction)
- **Lenis** smooth scrolling (mouse/trackpad only; touch keeps native momentum)
- **Lucide** icons, **Google Sans** (text) + **Poppins** (display), self-hosted and subset
- Hand-written CSS motion: scroll reveals, word-by-word highlight, pinned horizontal case studies,
  growth curve, magnetic buttons, custom cursor, app-style mobile dock

## Editing content

Every word lives in [`src/data/site.ts`](src/data/site.ts). The page, JSON-LD, `llms.txt`,
`llms-full.txt`, the WebMCP agent tools and the résumé all read from it.

Things still to fill in there:

- `site.linkedin`: set it to the real `linkedin.com/in/...` URL and flip `linkedinIsProfile` to `true`
  (that also adds it to the structured data `sameAs`)
- Internship numbers, the App Innovation Technologies stack, the Power BI issuer, Loom/PDF links,
  client brand names and a testimonial, once confirmed

After changing content, regenerate the résumé PDF and social image with `npm run assets`.

## Analytics

Paste the embed code where `<!-- ANALYTICS: ... -->` sits in [`src/layouts/Base.astro`](src/layouts/Base.astro).

## SEO and AI search

- Meta title/description, focus/primary/secondary keywords: `seo` in `src/data/site.ts`
- Schema.org JSON-LD: `WebSite`, `ProfilePage`, `Person`, `FAQPage`
- `llms.txt` + `llms-full.txt` for ChatGPT, Claude, Gemini, Perplexity, DeepSeek and other assistants
- `.well-known/ai-catalog.json` (Agentic Resource Discovery) linked via `<link rel="ai-catalog">`
- WebMCP tools (`get_profile`, `answer_faq`, `get_contact_details`, `navigate_to_section`,
  `draft_email_to_tharani`) registered for in-browser AI agents
- `sitemap.xml`, Open Graph/Twitter cards, `robots.txt` that welcomes AI crawlers

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve `dist/` like GitHub Pages at `localhost:4321/tharau-portfolio/` |
| `npm run assets` | Rebuild résumé PDF + OG image (needs Playwright) |
| `npm run fonts` | Re-subset fonts from `fonts-src/` |
| `npm run lighthouse` | Lighthouse mobile + desktop against the preview server |

## Deploying

Pushing to `main` (or the working branch) runs `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to the `gh-pages` branch. GitHub Pages serves that branch.
