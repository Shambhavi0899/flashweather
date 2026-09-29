'use server';

import {
  deliverDemoRequest,
  demoRequestMailto,
  parseDemoRequest,
  type DemoRequestField,
  type DemoRequestValues,
} from '@/lib/demo-request';
import { site } from '@/lib/seo/site';

export type DemoFormState = {
  status: 'idle' | 'invalid' | 'sent' | 'not-sent';
  message: string;
  errors?: Partial<Record<DemoRequestField, string>>;
  values?: DemoRequestValues;
  /** A prefilled email to the team, offered when the form could not deliver. */
  mailto?: string;
};

/**
 * The demo form's Server Action. It validates, hands the request to the one
 * delivery function, and reports what actually happened: success only when
 * delivery confirmed it, otherwise an honest "not sent, email us".
 */
export async function submitDemoRequest(_prev: DemoFormState, formData: FormData): Promise<DemoFormState> {
  const parsed = parseDemoRequest(formData);

  if (!parsed.ok) {
    return {
      status: 'invalid',
      message: 'Some details need fixing before we can send this.',
      errors: parsed.errors,
      values: parsed.values,
    };
  }

  let delivered = false;
  try {
    delivered = (await deliverDemoRequest(parsed.request)).delivered;
  } catch {
    delivered = false;
  }

  if (delivered) {
    return {
      status: 'sent',
      message: `Thanks, ${parsed.request.name}. We have your request and will reply within one business day.`,
    };
  }

  return {
    status: 'not-sent',
    message: `Your request has not been sent: this form cannot deliver requests yet. Please email ${site.salesEmail} with the same details and we will reply within one business day.`,
    values: parsed.values,
    mailto: demoRequestMailto(parsed.values),
  };
}
