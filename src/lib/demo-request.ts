/**
 * The demo request: its fields, its validation, and the one place it is sent.
 *
 * The form on /contact/ posts through a Server Action
 * (`src/app/contact/actions.ts`), which validates here and then calls
 * `deliverDemoRequest()`. Delivery is deliberately isolated in that single
 * function so wiring the real destination -- CRM, email, both -- touches
 * nothing else.
 */

import { site } from '@/lib/seo/site';

export const ROLES = [
  'Athletic director',
  'Superintendent',
  'Safety manager',
  'Operations director',
  'Agronomist',
  'Developer',
  'Other',
] as const;

export const INDUSTRIES = [
  'Schools & athletics',
  'Golf',
  'Construction',
  'Roofing',
  'Agriculture',
  'Insurance',
  'Fleet',
  'Other',
] as const;

export type DemoRequest = {
  name: string;
  email: string;
  organisation: string;
  role: (typeof ROLES)[number];
  sites: number;
  industry: (typeof INDUSTRIES)[number];
  phone?: string;
  message?: string;
};

export type DemoRequestField = keyof DemoRequest;

/** The raw strings as submitted, echoed back so a failed submit keeps them. */
export type DemoRequestValues = Partial<Record<DemoRequestField, string>>;

export type ParseResult =
  | { ok: true; request: DemoRequest; values: DemoRequestValues }
  | { ok: false; errors: Partial<Record<DemoRequestField, string>>; values: DemoRequestValues };

const FIELDS: DemoRequestField[] = ['name', 'email', 'organisation', 'role', 'sites', 'industry', 'phone', 'message'];
const MAX = { name: 120, email: 254, organisation: 160, phone: 40, message: 4000 } as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseDemoRequest(formData: FormData): ParseResult {
  const values: DemoRequestValues = {};
  for (const field of FIELDS) {
    const raw = formData.get(field);
    values[field] = typeof raw === 'string' ? raw.trim() : '';
  }

  const errors: Partial<Record<DemoRequestField, string>> = {};
  const { name = '', email = '', organisation = '', role = '', sites = '', industry = '', phone = '', message = '' } =
    values;

  if (!name) errors.name = 'Enter your full name.';
  else if (name.length > MAX.name) errors.name = 'That name is too long.';

  if (!email) errors.email = 'Enter your work email.';
  else if (email.length > MAX.email || !EMAIL.test(email)) errors.email = 'Enter an email address like you@organisation.com.';

  if (!organisation) errors.organisation = 'Enter your organisation.';
  else if (organisation.length > MAX.organisation) errors.organisation = 'That organisation name is too long.';

  if (!(ROLES as readonly string[]).includes(role)) errors.role = 'Select your role.';
  if (!(INDUSTRIES as readonly string[]).includes(industry)) errors.industry = 'Select your industry.';

  const siteCount = Number(sites);
  if (!sites) errors.sites = 'Enter how many sites you run.';
  else if (!Number.isInteger(siteCount) || siteCount < 1 || siteCount > 100000)
    errors.sites = 'Enter a whole number of sites, 1 or more.';

  if (phone.length > MAX.phone) errors.phone = 'That phone number is too long.';
  if (message.length > MAX.message) errors.message = `Keep the message under ${MAX.message} characters.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors, values };

  return {
    ok: true,
    values,
    request: {
      name,
      email,
      organisation,
      role: role as DemoRequest['role'],
      sites: siteCount,
      industry: industry as DemoRequest['industry'],
      ...(phone ? { phone } : {}),
      ...(message ? { message } : {}),
    },
  };
}

export type DeliveryResult = { delivered: true } | { delivered: false; reason: 'not-configured' | 'failed' };

/**
 * Send a validated demo request to the team.
 *
 * TODO(backend): there is no delivery yet. Wire the CRM (create the contact
 * and a demo deal) and/or a transactional email to the sales inbox here, read
 * credentials from server-only environment variables, and return
 * `{ delivered: true }` ONLY after the destination has confirmed receipt.
 * Return `{ delivered: false, reason: 'failed' }` on any error.
 *
 * Until then this returns `not-configured`, and the form tells the visitor
 * plainly that the request was not sent and to email the team instead. It
 * must never report success for a request that went nowhere.
 */
export async function deliverDemoRequest(request: DemoRequest): Promise<DeliveryResult> {
  void request;
  return { delivered: false, reason: 'not-configured' };
}

/** A prefilled email to the sales inbox (`site.salesEmail`), for when the form cannot deliver. */
export function demoRequestMailto(values: DemoRequestValues): string {
  const lines = [
    `Name: ${values.name ?? ''}`,
    `Work email: ${values.email ?? ''}`,
    `Organisation: ${values.organisation ?? ''}`,
    `Role: ${values.role ?? ''}`,
    `Number of sites: ${values.sites ?? ''}`,
    `Industry: ${values.industry ?? ''}`,
    ...(values.phone ? [`Phone: ${values.phone}`] : []),
    '',
    values.message ?? '',
  ];
  const subject = `Demo request${values.organisation ? `: ${values.organisation}` : ''}`;
  return `mailto:${site.salesEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}
