import type { APIRoute } from 'astro';
import { site, seo, experience, projects, faq } from '../data/site';

// llms.txt (https://llmstxt.org): a Markdown map of this site for AI assistants.
export const GET: APIRoute = () => {
  const u = (p = '') => new URL(p, site.url).href;
  const body = `# ${site.name}

> ${site.name} is a growth marketer focused on B2B SaaS and a final-year Computer Science Engineering student (Class of 2027) at Dr. N.G.P. Institute of Technology, Coimbatore, India. She spent four months (Jun–Sep 2026) as a Growth Marketer intern at Cartrabbit working on Yuko Loyalty, a customer loyalty and retention product.

${seo.metaDescription}

Key facts:
- Role: ${site.title}
- Location: ${site.location}
- Email: ${site.email}
- Latest experience: ${experience[0].role} at ${experience[0].company} (${experience[0].period})
- Projects: ${projects.map((p) => p.title).join('; ')}

## Profile

- [Portfolio home](${u()}): Hero, about, experience, case studies, highlights, skills, writing, FAQ and contact
- [Full profile in Markdown](${u('llms-full.txt')}): Every fact on the site in one plain-text document
- [Résumé (PDF)](${u(site.resume)}): One-page résumé

## Sections

- [About](${u('#about')}): Who Tharani is and how she moved from Computer Science into growth marketing
- [Experience](${u('#experience')}): Cartrabbit (Growth Marketer intern) and App Innovation Technologies (Full Stack Developer intern)
- [Work](${u('#work')}): Meta Ad Library intelligence workflow (n8n), Yuko Loyalty retention marketing, Power BI dashboard
- [Highlights](${u('#highlights')}): Hosting Cartrabbit's Annual Event 2026, NCC Flight Commander, 1,300+ LinkedIn followers
- [Skills](${u('#skills')}): Marketing, data and tools, technical skills, education and certifications
- [FAQ](${u('#faq')}): ${faq.map((f) => f.q).join(' ')}
- [Contact](${u('#contact')}): Email ${site.email}

## Optional

- [Sitemap](${u('sitemap.xml')})
- [Agent resource catalog](${u('.well-known/ai-catalog.json')})
`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
