// Single source of truth for every word on the site.
// Edit here and the page, JSON-LD, llms.txt and resume all stay in sync.

export const site = {
  url: 'https://dakshu007.github.io/tharau-portfolio/',
  name: 'Tharani Muthukumar',
  firstName: 'Tharani',
  lastName: 'Muthukumar',
  title: 'Growth Marketer · B2B SaaS',
  location: 'Coimbatore, Tamil Nadu, India',
  email: 'tharanimuthukumar12@gmail.com',
  // TODO: replace with Tharani's exact public profile URL (linkedin.com/in/...)
  linkedin: 'https://www.linkedin.com/search/results/people/?keywords=Tharani%20Muthukumar%20Cartrabbit',
  linkedinIsProfile: false,
  resume: 'Tharani-Muthukumar-Resume.pdf',
  oneLiner:
    'I like understanding products, finding the right positioning, and making them matter to the right people.',
  subLine:
    'Computer Science Engineering student (Class of 2027) at Dr. N.G.P. Institute of Technology, Coimbatore',
};

export const seo = {
  metaTitle: 'Tharani Muthukumar | Growth Marketer, B2B SaaS Portfolio',
  metaDescription:
    'Tharani Muthukumar is a B2B SaaS growth marketer from Coimbatore: product positioning, retention marketing for Yuko Loyalty at Cartrabbit, n8n and Power BI.',
  focusKeyword: 'Tharani Muthukumar',
  primaryKeyword: 'Growth Marketer B2B SaaS',
  secondaryKeywords: [
    'growth marketer Coimbatore',
    'product marketing',
    'retention marketing',
    'loyalty marketing',
    'positioning and messaging',
    'customer research',
    'competitor ad analysis',
    'n8n automation',
    'Power BI',
    'Yuko Loyalty',
    'Cartrabbit',
    'marketing portfolio',
  ],
};

export const about = [
  "I'm a Computer Science engineering student who found her way into growth marketing and never looked back. At Cartrabbit, I spent four months on Yuko Loyalty, learning by doing: understanding customers, working on product positioning, experimenting with approaches and figuring out how to communicate value.",
  'My CS background lets me work comfortably with data and tools, from Power BI dashboards to automation workflows in n8n. My love for people shows up on stage: I hosted Cartrabbit\'s Annual Event 2026.',
  "These days I look at every business through a marketing lens: what they sell, who it's for, and how I'd take it to market.",
];

export const stats = [
  { value: 4, suffix: '', label: 'months in growth marketing at Cartrabbit' },
  { value: 1300, suffix: '+', label: 'LinkedIn followers built through storytelling' },
  { value: 200, suffix: '+', label: 'reactions on my event-hosting post' },
  { value: 2, suffix: '', label: 'internships: marketing and full-stack' },
];

export const experience = [
  {
    role: 'Growth Marketer (Internship)',
    company: 'Cartrabbit',
    period: 'Jun 2026 – Sep 2026',
    start: '2026-06',
    end: '2026-09',
    location: 'Coimbatore',
    summary:
      "Growth and product marketing for Yuko Loyalty, Cartrabbit's customer loyalty and retention product.",
    points: [
      "Worked on growth and product marketing for Yuko Loyalty, Cartrabbit's customer loyalty and retention product",
      'Worked with regional D2C brands, focused on retention: helping them turn loyal customers into repeat orders',
      'Customer research, product positioning and messaging experiments',
      'Took part in sales demos alongside the team',
      "Hosted the company's Annual Event 2026 on 3 July 2026",
    ],
    tags: ['Positioning', 'Retention', 'Customer research', 'Sales demos'],
  },
  {
    role: 'Full Stack Developer Intern',
    company: 'App Innovation Technologies',
    period: 'Jun 2025',
    start: '2025-06',
    end: '2025-06',
    location: 'Coimbatore',
    summary: 'Full-stack development internship during my Computer Science degree.',
    points: ['Hands-on full-stack development internship during my Computer Science degree'],
    tags: ['Full-stack', 'Engineering'],
  },
];

export const projects = [
  {
    id: 'meta-ads',
    index: '01',
    kicker: 'Automation · Competitor intelligence',
    title: 'Meta Ad Library intelligence workflow',
    body: 'An n8n automation that scrapes and analyses competitor ads from the Meta Ad Library, so ad research turns into a repeatable insight engine instead of a manual scroll.',
    deliverables: ['n8n workflow', 'PDF insights report', 'Loom walkthrough'],
    tags: ['n8n', 'Meta Ad Library', 'Competitor ad analysis'],
    visual: 'flow',
  },
  {
    id: 'yuko',
    index: '02',
    kicker: 'Retention marketing · Cartrabbit',
    title: 'Yuko Loyalty: turning loyal customers into repeat orders',
    body: 'Brands were losing repeat customers. I worked on how Yuko Loyalty is positioned and messaged, and on outreach to brands, so the value of a loyalty and retention program lands with the right people.',
    deliverables: ['Positioning', 'Messaging', 'Brand outreach'],
    tags: ['Retention', 'Loyalty', 'B2B SaaS'],
    visual: 'loop',
  },
  {
    id: 'powerbi',
    index: '03',
    kicker: 'Data · Certification work',
    title: 'Power BI dashboard',
    body: 'A dashboard built during my Data Analytics using Power BI certification: turning raw data into a view a marketer can act on.',
    deliverables: ['Data modelling', 'Dashboard design', 'Insight storytelling'],
    tags: ['Microsoft Power BI', 'Data analytics'],
    visual: 'bars',
  },
];

export const highlights = [
  {
    icon: 'mic',
    title: "Hosted Cartrabbit's Annual Event 2026",
    body: 'On stage in front of the whole company. My post about it got 200+ reactions.',
    metric: '200+',
    metricLabel: 'reactions',
  },
  {
    icon: 'trending',
    title: 'From Computer Science to growth marketing',
    body: 'Made the switch and was trusted with customer-facing work during the internship.',
  },
  {
    icon: 'message',
    title: 'Recognised for sales demos',
    body: "Called out by Cartrabbit's People Ops team for my work in sales demos while still a student.",
  },
  {
    icon: 'medal',
    title: 'NCC Air Wing Cadet, Flight Commander',
    body: 'National Cadet Corps, 2017 – 2019.',
  },
  {
    icon: 'users',
    title: 'A LinkedIn audience of 1,300+',
    body: 'Built through storytelling posts about marketing, work and growing up into a career.',
    metric: '1,300+',
    metricLabel: 'followers',
  },
];

export const skills = [
  {
    group: 'Marketing',
    icon: 'target',
    items: [
      'Growth marketing',
      'Product marketing',
      'Positioning & messaging',
      'Retention & loyalty marketing',
      'Customer research',
      'Competitor ad analysis',
      'Sales demos',
      'LinkedIn content & storytelling',
    ],
  },
  { group: 'Data & tools', icon: 'chart', items: ['Microsoft Power BI', 'n8n automation', 'Loom'] },
  {
    group: 'Technical',
    icon: 'code',
    items: ['Full-stack development basics', 'Computer Science Engineering'],
  },
  { group: 'Other', icon: 'presentation', items: ['Project management', 'Public speaking', 'Event hosting'] },
];

export const education = [
  {
    title: 'B.E. Computer Science Engineering',
    org: 'Dr. N.G.P. Institute of Technology, Coimbatore',
    meta: 'Class of 2027',
    icon: 'grad',
  },
  { title: 'Schooling', org: 'RVS Group of Institutions, Coimbatore', meta: 'School', icon: 'book' },
];

export const certifications = [{ title: 'Data Analytics using Power BI', meta: 'Power BI', icon: 'award' }];

export const leadership = [
  {
    title: 'NCC Air Wing Cadet, Flight Commander',
    org: 'National Cadet Corps',
    meta: 'Jun 2017 – Apr 2019 · 1 yr 11 mos',
    icon: 'plane',
  },
];

export const writing = [
  {
    title: 'A ₹5 Kurkure made me ignore a job opportunity',
    blurb: 'How I started thinking like a marketer.',
    tag: 'Marketing lens',
  },
  {
    title: 'Just two months into my first corporate job…',
    blurb: "Hosting Cartrabbit's Annual Event 2026.",
    tag: 'On stage',
  },
  {
    title: 'Conversation & Conversion',
    blurb: 'The sales demo story.',
    tag: 'Sales',
  },
];

export const marquee = [
  'Growth marketing',
  'Product positioning',
  'Retention & loyalty',
  'Customer research',
  'Messaging experiments',
  'Sales demos',
  'n8n automation',
  'Power BI',
  'Storytelling',
  'Public speaking',
];

export const faq = [
  {
    q: 'Who is Tharani Muthukumar?',
    a: 'Tharani Muthukumar is a growth marketer focused on B2B SaaS and a final-year Computer Science Engineering student (Class of 2027) at Dr. N.G.P. Institute of Technology in Coimbatore, India.',
  },
  {
    q: 'What did Tharani Muthukumar do at Cartrabbit?',
    a: "From June to September 2026 she was a Growth Marketer intern at Cartrabbit, working on growth and product marketing for Yuko Loyalty, Cartrabbit's customer loyalty and retention product. Her work covered customer research, product positioning, messaging experiments, retention work with regional D2C brands and sales demos. She also hosted Cartrabbit's Annual Event 2026.",
  },
  {
    q: 'What tools and skills does Tharani use?',
    a: 'Growth and product marketing, positioning and messaging, retention and loyalty marketing, customer research and competitor ad analysis, plus Microsoft Power BI, n8n automation and Loom. Her Computer Science degree and a full-stack internship at App Innovation Technologies give her a technical foundation.',
  },
  {
    q: 'What projects has Tharani built?',
    a: 'An n8n workflow that scrapes and analyses competitor ads from the Meta Ad Library (with a PDF insights report and Loom walkthrough), retention marketing work for Yuko Loyalty, and a Power BI dashboard from her Data Analytics using Power BI certification.',
  },
  {
    q: 'How can I contact Tharani Muthukumar?',
    a: 'Email tharanimuthukumar12@gmail.com or connect with her on LinkedIn. She is based in Coimbatore, India.',
  },
];

export const nav = [
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#highlights', label: 'Highlights' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
];
