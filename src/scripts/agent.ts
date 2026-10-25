// WebMCP: expose a few safe, read-mostly tools so browser AI agents can
// understand this portfolio and act on it without scraping the DOM.
// https://developer.chrome.com/docs/ai/webmcp
import { site, about, experience, projects, highlights, skills, education, certifications, leadership, faq } from '../data/site';

type ToolResult = { content: { type: 'text'; text: string }[] };
type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
};
type ModelContext = {
  registerTool?: (tool: Tool) => unknown;
  provideContext?: (ctx: { tools: Tool[] }) => unknown;
};

const text = (t: string): ToolResult => ({ content: [{ type: 'text', text: t }] });
const resumeUrl = new URL(site.resume, site.url).href;

const SECTIONS = ['top', 'about', 'experience', 'work', 'highlights', 'skills', 'writing', 'faq', 'contact'] as const;

function profileMarkdown() {
  return [
    `# ${site.name}`,
    `${site.title}. ${site.subLine}. Based in ${site.location}.`,
    '',
    '## About',
    ...about,
    '',
    '## Experience',
    ...experience.map((e) => `- ${e.role}, ${e.company} (${e.period}, ${e.location}): ${e.points.join('; ')}`),
    '',
    '## Projects',
    ...projects.map((p) => `- ${p.title}: ${p.body} Deliverables: ${p.deliverables.join(', ')}.`),
    '',
    '## Highlights',
    ...highlights.map((h) => `- ${h.title}: ${h.body}`),
    '',
    '## Skills',
    ...skills.map((s) => `- ${s.group}: ${s.items.join(', ')}`),
    '',
    '## Education, certifications & leadership',
    ...education.map((e) => `- ${e.title}, ${e.org} (${e.meta})`),
    ...certifications.map((c) => `- Certification: ${c.title}`),
    ...leadership.map((l) => `- ${l.title}, ${l.org} (${l.meta})`),
    '',
    '## Contact',
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.linkedin}`,
    `- Résumé (PDF): ${resumeUrl}`,
  ].join('\n');
}

export function registerAgentTools({ scrollTo }: { scrollTo: (el: HTMLElement) => void }) {
  const mc = (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
  if (!mc) return;

  const tools: Tool[] = [
    {
      name: 'get_profile',
      description:
        "Get Tharani Muthukumar's full professional profile as Markdown: about, experience, projects, highlights, skills, education and contact details.",
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => text(profileMarkdown()),
    },
    {
      name: 'answer_faq',
      description: 'Get short, factual answers to common questions about Tharani Muthukumar (who she is, her work at Cartrabbit, tools, projects, contact).',
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => text(faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join('\n\n')),
    },
    {
      name: 'get_contact_details',
      description: "Get Tharani Muthukumar's email address, LinkedIn link and résumé PDF link.",
      inputSchema: { type: 'object', properties: {} },
      annotations: { readOnlyHint: true },
      execute: () => text(JSON.stringify({ email: site.email, linkedin: site.linkedin, resume: resumeUrl, location: site.location })),
    },
    {
      name: 'navigate_to_section',
      description: 'Scroll the portfolio page to a section so the user can see it.',
      inputSchema: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            enum: [...SECTIONS],
            description: 'Section id: top, about, experience, work, highlights, skills, writing, faq or contact.',
          },
        },
        required: ['section'],
      },
      execute: (input) => {
        const id = String(input.section ?? '');
        const el = SECTIONS.includes(id as (typeof SECTIONS)[number]) ? document.getElementById(id) : null;
        if (!el) return text(`Unknown section "${id}". Use one of: ${SECTIONS.join(', ')}.`);
        scrollTo(el);
        return text(`Scrolled to the ${id} section.`);
      },
    },
    {
      name: 'draft_email_to_tharani',
      description: "Open the user's email app with a pre-filled draft to Tharani Muthukumar. The user reviews and sends it themselves.",
      inputSchema: {
        type: 'object',
        properties: {
          subject: { type: 'string', description: 'Email subject line.' },
          message: { type: 'string', description: 'Email body text.' },
        },
        required: ['subject', 'message'],
      },
      execute: (input) => {
        const params = new URLSearchParams({ subject: String(input.subject ?? ''), body: String(input.message ?? '') });
        location.href = `mailto:${site.email}?${params.toString().replace(/\+/g, '%20')}`;
        return text('Opened an email draft addressed to Tharani for the user to review and send.');
      },
    },
  ];

  try {
    if (typeof mc.registerTool === 'function') tools.forEach((t) => mc.registerTool!(t));
    else if (typeof mc.provideContext === 'function') mc.provideContext({ tools });
  } catch {
    /* WebMCP is experimental; never let it break the page. */
  }
}
