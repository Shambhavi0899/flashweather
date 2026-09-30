/**
 * Flash Agent page content, as data.
 *
 * Copy is the design's (Paper "12b · Flash Agent"), verbatim. The question
 * lists are the ones industry pages point at when they say "ask Flash Agent",
 * so they live here rather than in JSX: one list, one place to add a question.
 *
 * The conversations the page plays are not here: its "Ask the question your
 * crew actually asks" section is the home page's, with the home page's data
 * (content/home.ts `agentTabs` and `agentFlow`).
 */

export type AgentIndustry = {
  /** Anchor id for the tab and the column. */
  id: string;
  label: string;
  /** The industry page this column links to. */
  href: string;
  image: { src: string; alt: string };
  questions: string[];
};

export const agentIndustries: AgentIndustry[] = [
  {
    id: 'construction',
    label: 'Construction and Concrete',
    href: '/industries-we-serve/construction/',
    image: {
      src: '/images/agent/flash-agent-industry-construction-tower-crane-storm-sky.jpg',
      alt: 'A tower crane against a bruised storm sky above an unfinished concrete structure, heading the construction and concrete question column',
    },
    questions: [
      'When will ground conditions dry out enough to mobilize heavy earthmoving equipment?',
      'Are wind gusts low enough to safely operate cranes and work at elevated heights?',
      'Is humidity and temperature within acceptable ranges for exterior painting or sealants?',
      'Do we need to secure or cover loose materials?',
      'What are the best days to pour concrete?',
      'Which of my job sites should I assign crews for tomorrow?',
      'What time will the best lightning chance be today to shut down operations?',
    ],
  },
  {
    id: 'roofing',
    label: 'Roofing and Exteriors',
    href: '/industries-we-serve/roofing/',
    image: {
      src: '/images/agent/flash-agent-industry-roofing-tear-off-shelf-cloud.jpg',
      alt: 'A half-stripped residential roof with fresh underlayment and a ladder as a storm shelf cloud advances, heading the roofing and exteriors question column',
    },
    questions: [
      'What days this week offer viable 5-hour windows to tear off a residential roof and get back to watertight?',
      'Is humidity and temperature within acceptable ranges for exterior painting or sealants?',
      'Do we need to secure or cover loose materials?',
      'Which of my job sites should I assign crews for tomorrow?',
    ],
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    href: '/industries-we-serve/agriculture/',
    image: {
      src: '/images/agent/flash-agent-industry-agriculture-crop-rows-dawn-frost.jpg',
      alt: 'Irrigated crop rows under dawn frost with mist lying between the furrows, heading the agriculture question column',
    },
    questions: [
      'Do I need to cover crops tonight?',
      'Will I need to irrigate more due to conditions leading to crop and turf stress?',
      'What is the growing degree day outlook over the next week or two?',
      'What are the current drought conditions and how will it impact irrigation?',
      'When will we get the first frost?',
      'Should I buy more crop insurance in the next 10 days?',
      'Are wind gusts too high to efficiently apply a spray application on my property?',
    ],
  },
  {
    id: 'golf',
    label: 'Golf and Turf',
    href: '/industries-we-serve/golf/',
    image: {
      src: '/images/agent/flash-agent-industry-golf-fairway-under-rain.jpg',
      alt: 'A golf fairway under fine rain at dusk with wet turf catching the last light, heading the golf and turf question column',
    },
    questions: [
      'How much water should I put on the golf course today/tonight?',
      'Will I need to irrigate more due to conditions leading to crop and turf stress?',
      'Are wind gusts too high to efficiently apply a spray application on my property?',
      'What time will the best lightning chance be today to shut down operations?',
    ],
  },
  {
    id: 'schools',
    label: 'Schools, Parks and Sports',
    href: '/industries-we-serve/schools/',
    image: {
      src: '/images/agent/flash-agent-industry-schools-floodlit-field-dusk.jpg',
      alt: 'A floodlit school athletic field at dusk with light towers burning against a deep blue sky, heading the schools, parks and sports question column',
    },
    questions: [
      'Will our baseball fields be too saturated to play a game this Friday?',
      'Will the wind chill make transportation to school unsafe for walkers and bus riders?',
      'What time will the best lightning chance be today to shut down operations?',
    ],
  },
];

/**
 * A Flash Agent answer, as <AgentConversation> shows it
 * (components/agent-conversation). The home page's answers have this shape
 * too (content/home.ts `AgentAnswer`, plus the chart they draw).
 */
export type AgentReply = {
  /** Who and when the answer is about, beside the agent's name. */
  site: string;
  status: { tone: 'warning' | 'clear' | 'watch'; label: string };
  answer: string;
  /** The chart in words, for screen readers; the chart itself is hidden from them. */
  chartSummary?: string;
  chips: { label: string; value: string }[];
  primaryAction: string;
  secondaryAction: string;
  followUps: string[];
};

export const agentToolChips = [
  'Google Calendar',
  'Microsoft 365',
  'Salesforce',
  'HubSpot',
  'NetSuite · SAP',
  'Procore',
  'Slack · Teams',
  'Golf Genius',
  'Webhooks · API',
];

export const agentHarnessChecks = [
  'Permissions per connector',
  'Memory of your sites and policies',
  'Audit log, exportable',
  'Human confirmation before a schedule or record changes',
];

export const agentEngineStats = [
  { value: '100+', label: 'atmospheric parameters in the API and Edge Model' },
  { value: '1×1 km', label: 'cells across the continental U.S., Canada and Mexico' },
  { value: '2 min', label: 'lightning refresh; 5 minutes for hail' },
  { value: '60 min', label: 'strike-level horizon; 6-hour prediction outlook' },
];

export const agentIntegrations = [
  { name: 'Google Calendar', body: 'Moves or shortens events inside a risk window and tells attendees why.' },
  {
    name: 'Microsoft 365 / Outlook',
    body: 'Reschedules shifts and meetings, mails the all-clear, files the audit log in SharePoint.',
  },
  {
    name: 'Salesforce',
    body: 'Tags accounts and sites hit by hail; opens tasks and cases with the cell and run attached.',
  },
  {
    name: 'HubSpot',
    body: 'Pushes canvass lists and sequences for hail-hit streets; logs the event on the company.',
  },
  { name: 'NetSuite', body: 'Holds or reschedules work orders and adds the weather-delay note.' },
  { name: 'SAP', body: 'Raises a weather hold on a maintenance order and notifies the planner.' },
  {
    name: 'Procore',
    body: 'Reschedules crane lifts and pours, writes the delay to the daily log, texts the foreman.',
  },
  { name: 'Slack', body: 'Answers in-channel, posts the call and the reason, collects the confirmation.' },
  { name: 'Microsoft Teams', body: 'Same as Slack, with an adaptive card for the confirmation.' },
  { name: 'Golf Genius', body: 'Flags tee times inside a Watch, proposes shotgun delays, notifies the pro shop.' },
  { name: 'Webhooks / API', body: 'Fires your own automations on any alert, all-clear or model run.' },
];

/**
 * What each connector may do on one site, shown when a tool is opened in the
 * integrations list. Drafted from each tool's line above and the guardrails
 * below (per-site permissions; schedule and record changes need a human
 * confirmation). Awaiting approval. Keyed by `agentIntegrations[].name`.
 */
export type IntegrationPermission = { kind: 'read' | 'propose' | 'post' | 'confirm'; label: string; detail: string };

const confirmEvery = (what: string): IntegrationPermission => ({
  kind: 'confirm',
  label: 'Changes need confirmation',
  detail: `Every ${what} waits for a person`,
});

export const agentIntegrationPermissions: Record<string, IntegrationPermission[]> = {
  'Google Calendar': [
    { kind: 'read', label: 'Read', detail: "Events on the site's calendars" },
    { kind: 'propose', label: 'Propose changes', detail: 'Move or shorten events, with a note to attendees' },
    confirmEvery('event change'),
  ],
  'Microsoft 365 / Outlook': [
    { kind: 'read', label: 'Read', detail: 'Calendars, shifts and meetings' },
    { kind: 'propose', label: 'Propose changes', detail: 'Reschedules, the all-clear mail, the SharePoint audit log' },
    confirmEvery('shift or meeting change'),
  ],
  Salesforce: [
    { kind: 'read', label: 'Read', detail: 'Accounts and sites in the hail path' },
    { kind: 'propose', label: 'Propose changes', detail: 'Hail tags, tasks and cases, with the cell and run attached' },
    confirmEvery('record change'),
  ],
  HubSpot: [
    { kind: 'read', label: 'Read', detail: 'Companies and contacts on hail-hit streets' },
    { kind: 'propose', label: 'Propose changes', detail: 'Canvass lists and sequences; the event on the company' },
    confirmEvery('list, sequence or record change'),
  ],
  NetSuite: [
    { kind: 'read', label: 'Read', detail: 'Work orders at the site' },
    { kind: 'propose', label: 'Propose changes', detail: 'A hold or reschedule, with the weather-delay note' },
    confirmEvery('work-order change'),
  ],
  SAP: [
    { kind: 'read', label: 'Read', detail: 'Maintenance orders at the site' },
    { kind: 'propose', label: 'Propose changes', detail: 'A weather hold, and a note to the planner' },
    confirmEvery('maintenance-order change'),
  ],
  Procore: [
    { kind: 'read', label: 'Read', detail: 'The schedule and the daily log' },
    { kind: 'propose', label: 'Propose changes', detail: 'Move lifts and pours, log the delay, text the foreman' },
    confirmEvery('schedule change'),
  ],
  Slack: [
    { kind: 'read', label: 'Read', detail: "Questions in the channels it's added to" },
    { kind: 'post', label: 'Post', detail: 'The call and the reason, in the channel' },
    { kind: 'confirm', label: 'Collects confirmations', detail: 'People confirm changes here; each one is logged' },
  ],
  'Microsoft Teams': [
    { kind: 'read', label: 'Read', detail: "Questions in the channels it's added to" },
    { kind: 'post', label: 'Post', detail: 'The call and the reason, in the channel' },
    { kind: 'confirm', label: 'Collects confirmations', detail: 'On an adaptive card; each one is logged' },
  ],
  'Golf Genius': [
    { kind: 'read', label: 'Read', detail: 'Tee times at the course' },
    { kind: 'propose', label: 'Propose changes', detail: 'Shotgun delays for tee times inside a Watch; a note to the pro shop' },
    confirmEvery('tee-time change'),
  ],
  'Webhooks / API': [
    { kind: 'read', label: 'Read', detail: 'Alerts, all-clears and model runs for the site' },
    { kind: 'post', label: 'Send', detail: 'Each event to your own endpoints' },
    { kind: 'confirm', label: 'Your rules decide', detail: 'It changes nothing in your tools by itself' },
  ],
};

export type Guardrail = { icon: 'lock' | 'target' | 'doc' | 'check'; title: string; body: string };

export const agentGuardrails: Guardrail[] = [
  {
    icon: 'lock',
    title: 'Permissions per connector',
    body: 'Each tool is switched on per site with its own scope. Turn one off and the agent loses it immediately; the log keeps the history.',
  },
  {
    icon: 'target',
    title: 'Every answer cites its cell and model run',
    body: 'The 1×1 km cell id and the run time sit under every answer, so anyone can check it against the map and the accuracy method.',
  },
  {
    icon: 'doc',
    title: 'Every action logged and exportable',
    body: 'Who asked, what was read, what changed and who confirmed it — exportable to your audit file, SharePoint or the API.',
  },
  {
    icon: 'check',
    title: 'Schedule and record changes need a human confirmation',
    body: 'It prepares the change and waits. A person confirms in Slack, Teams, SMS or the app, and that confirmation is logged with the action.',
  },
];

/**
 * The guardrails section's worked example: one proposed action passing the
 * four guardrails in order (agent-guardrails.tsx). Illustrative, and the same
 * Thursday practice as the Heat page's Ask Flash example
 * (components/products/heat/content.ts `agentExample`): cell 3391, the 12:02
 * run, confirmed at 12:04. `checks` line up with `agentGuardrails`; the last
 * one shows `waiting` until a person confirms.
 */
export const agentGuardrailRun = {
  label: 'Proposed action',
  action: 'Move Thursday practice to 5:30 pm',
  tool: 'Google Calendar',
  checks: [
    'Calendar write allowed for this site',
    'Cell 3391 · 12:02 run',
    'Entry created',
    'Confirmed by Coach Rivera',
  ],
  waiting: 'Waiting for a person',
  confirm: 'Confirm',
  done: 'Done · logged by Coach Rivera 12:04',
  note: 'Illustrative example',
};

/**
 * The FAQ. Answers are the design's, with its two bare URL mentions turned
 * into prose: /integrations/ is not a built route, and /pricing/ is linked
 * from the visible answer. `answer` is what FAQPage schema carries, and it
 * matches the visible text word for word.
 */
export const agentFaqs = [
  {
    question: 'Does it replace the Command Center?',
    answer:
      'No. The Weather Command Center stays the map and the log for people who want to see every cell. Flash Agent is the shortest path from a question to an answer or an action; both read the same cells and write to the same event log.',
  },
  {
    question: 'Which tools does it work with?',
    answer:
      'Google Calendar, Microsoft 365 and Outlook, Salesforce, HubSpot, NetSuite, SAP, Procore, Slack, Microsoft Teams and Golf Genius today, plus webhooks and the Flash API for anything else. Each connector is switched on per site with its own permissions.',
  },
  {
    question: 'Can it act without asking?',
    answer:
      'Not on a schedule or a record. It can answer, notify and prepare a change on its own; moving a practice, rescheduling a lift or editing a tee sheet waits for a person to confirm, and that confirmation is logged with the action.',
  },
  {
    question: 'Where does my data go?',
    answer:
      'Your site list, policies and connector data stay in your tenant. The agent reads what each connector permits, cites the cell and model run behind every answer, and writes an exportable audit log. Nothing leaves your tenant without your consent.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Flash is priced per site. Flash Agent is included in the Portfolio and Enterprise plans; single-site plans can add it. What each plan includes is on the pricing page, and the demo form is the fastest way to a quote for a portfolio.',
  },
];
