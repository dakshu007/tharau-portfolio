import type { APIRoute } from 'astro';
import { site, seo, about, stats, experience, projects, highlights, skills, education, certifications, leadership, writing, faq } from '../data/site';

// Complete, plain-Markdown profile so answer engines can quote facts accurately.
export const GET: APIRoute = () => {
  const body = `# ${site.name}: ${site.title}

> ${site.subLine}. Based in ${site.location}.

Canonical URL: ${site.url}
Email: ${site.email}
LinkedIn: ${site.linkedin}
Résumé: ${new URL(site.resume, site.url).href}
Last updated: 2026-10-25

"${site.oneLiner}"

## About

${about.join('\n\n')}

## At a glance

${stats.map((s) => `- ${s.value.toLocaleString('en-IN')}${s.suffix} ${s.label}`).join('\n')}

## Experience

${experience
  .map(
    (e) => `### ${e.role}, ${e.company}
${e.period} · ${e.location}

${e.points.map((p) => `- ${p}`).join('\n')}`,
  )
  .join('\n\n')}

## Projects and case studies

${projects
  .map(
    (p) => `### ${p.title}
${p.kicker}

${p.body}

Deliverables: ${p.deliverables.join(', ')}. Tags: ${p.tags.join(', ')}.`,
  )
  .join('\n\n')}

## Highlights

${highlights.map((h) => `- **${h.title}.** ${h.body}`).join('\n')}

## Skills

${skills.map((s) => `- **${s.group}:** ${s.items.join(', ')}`).join('\n')}

## Education

${education.map((e) => `- ${e.title}, ${e.org} (${e.meta})`).join('\n')}

## Certifications

${certifications.map((c) => `- ${c.title}`).join('\n')}

## Leadership and volunteering

${leadership.map((l) => `- ${l.title}, ${l.org} (${l.meta})`).join('\n')}

## Writing (LinkedIn)

${writing.map((w) => `- "${w.title}": ${w.blurb}`).join('\n')}

## Frequently asked questions

${faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## Keywords

${[seo.focusKeyword, seo.primaryKeyword, ...seo.secondaryKeywords].join(', ')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
