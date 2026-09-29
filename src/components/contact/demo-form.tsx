'use client';

import { useActionState } from 'react';

import { submitDemoRequest, type DemoFormState } from '@/app/contact/actions';

const initialState: DemoFormState = { status: 'idle', message: '' };

const fieldBase =
  'h-12 w-full rounded-md border bg-neutral-0 px-[14px] text-body-s leading-5 text-text placeholder:text-text-subtle focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-alert-info';

type FieldName = keyof NonNullable<DemoFormState['errors']>;

function FieldError({ name, message }: { name: FieldName; message?: string }) {
  return message ? (
    <p id={`${name}-error`} className="text-micro font-medium text-alert-warning">
      {message}
    </p>
  ) : null;
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-caption font-semibold text-text">
      {children}
    </label>
  );
}

/**
 * The demo-request form. The one client leaf on /contact/: it needs
 * `useActionState` to show validation and the delivery result. Everything
 * around it is server-rendered.
 */
export function DemoForm({
  roles,
  industries,
  email,
}: {
  roles: readonly string[];
  industries: readonly string[];
  email: string;
}) {
  const [state, formAction, pending] = useActionState(submitDemoRequest, initialState);
  const errors = state.errors ?? {};
  const values = state.values ?? {};

  const describedBy = (name: FieldName, hint?: string) =>
    [hint, errors[name] ? `${name}-error` : undefined].filter(Boolean).join(' ') || undefined;
  const border = (name: FieldName) => (errors[name] ? 'border-alert-warning' : 'border-border-strong');

  // Keyed on the echoed values so a failed submit re-renders the fields with
  // what the visitor typed rather than blanking them.
  const formKey = JSON.stringify(values);

  return (
    <form key={formKey} action={formAction} className="flex flex-col gap-[18px]" aria-describedby="demo-form-status">
      <div className="grid gap-[18px] sm:grid-cols-2 sm:gap-4">
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="name">Full name</Label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            placeholder="First and last name"
            defaultValue={values.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy('name')}
            className={`${fieldBase} ${border('name')}`}
          />
          <FieldError name="name" message={errors.name} />
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="email">Work email</Label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            placeholder="you@organisation.com"
            defaultValue={values.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy('email')}
            className={`${fieldBase} ${border('email')}`}
          />
          <FieldError name="email" message={errors.email} />
        </div>
      </div>

      <div className="grid gap-[18px] sm:grid-cols-2 sm:gap-4">
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="organisation">Organisation</Label>
          <input
            id="organisation"
            name="organisation"
            type="text"
            autoComplete="organization"
            required
            maxLength={160}
            placeholder="Club, district, company or agency"
            defaultValue={values.organisation}
            aria-invalid={errors.organisation ? true : undefined}
            aria-describedby={describedBy('organisation')}
            className={`${fieldBase} ${border('organisation')}`}
          />
          <FieldError name="organisation" message={errors.organisation} />
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="role">Role</Label>
          <select
            id="role"
            name="role"
            autoComplete="organization-title"
            required
            defaultValue={values.role ?? ''}
            aria-invalid={errors.role ? true : undefined}
            aria-describedby={describedBy('role', 'role-hint')}
            className={`${fieldBase} ${border('role')} appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%228%22%3E%3Cpath%20d=%22M1%201l5%205%205-5%22%20fill=%22none%22%20stroke=%22%235F6B85%22%20stroke-width=%221.5%22/%3E%3C/svg%3E')] bg-position-[right_14px_center] bg-no-repeat pr-10`}
          >
            <option value="" disabled>
              Select role
            </option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <p id="role-hint" className="text-micro text-text-muted">
            {roles.join(' · ')}
          </p>
          <FieldError name="role" message={errors.role} />
        </div>
      </div>

      <div className="grid gap-[18px] sm:grid-cols-2 sm:gap-4">
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="sites">Number of sites</Label>
          <input
            id="sites"
            name="sites"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            required
            autoComplete="off"
            placeholder="Fields, courses, yards or roofs"
            defaultValue={values.sites}
            aria-invalid={errors.sites ? true : undefined}
            aria-describedby={describedBy('sites')}
            className={`${fieldBase} ${border('sites')}`}
          />
          <FieldError name="sites" message={errors.sites} />
        </div>
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            name="industry"
            required
            defaultValue={values.industry ?? ''}
            aria-invalid={errors.industry ? true : undefined}
            aria-describedby={describedBy('industry', 'industry-hint')}
            className={`${fieldBase} ${border('industry')} appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%228%22%3E%3Cpath%20d=%22M1%201l5%205%205-5%22%20fill=%22none%22%20stroke=%22%235F6B85%22%20stroke-width=%221.5%22/%3E%3C/svg%3E')] bg-position-[right_14px_center] bg-no-repeat pr-10`}
          >
            <option value="" disabled>
              Select industry
            </option>
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <p id="industry-hint" className="text-micro text-text-muted">
            {industries.join(' · ')}
          </p>
          <FieldError name="industry" message={errors.industry} />
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <Label htmlFor="phone">Phone (optional)</Label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          maxLength={40}
          placeholder="Only if you want a call-back instead of email"
          defaultValue={values.phone}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={describedBy('phone')}
          className={`${fieldBase} ${border('phone')}`}
        />
        <FieldError name="phone" message={errors.phone} />
      </div>

      <div className="flex flex-col gap-[6px]">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={4000}
          placeholder="Which sites, which season, and what your policy says about lightning, hail or heat"
          defaultValue={values.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy('message')}
          className={`${fieldBase} ${border('message')} h-auto min-h-24 py-3`}
        />
        <FieldError name="message" message={errors.message} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-gold-button flex h-12 items-center justify-center rounded-full text-body-s leading-caption font-extrabold tracking-[0.02em] text-brand-navy transition hover:brightness-[1.06] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? 'Sending…' : 'Book a demo'}
      </button>

      <div id="demo-form-status" role="status" aria-live="polite">
        {state.status !== 'idle' && (
          <div
            className={`rounded-md border px-4 py-3 text-body-s ${
              state.status === 'sent'
                ? 'border-alert-clear/40 bg-alert-clear/8 text-text'
                : state.status === 'invalid'
                  ? 'border-alert-warning/40 bg-alert-warning/6 text-text'
                  : 'border-alert-watch/50 bg-alert-watch/8 text-text'
            }`}
          >
            <p>{state.message}</p>
            {state.status === 'not-sent' && (
              <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-semibold">
                {state.mailto && (
                  <a href={state.mailto} className="text-brand-blue underline underline-offset-2">
                    Open an email with these details
                  </a>
                )}
                <a href={`mailto:${email}`} className="text-brand-blue underline underline-offset-2">
                  {email}
                </a>
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-micro text-text-muted">
        We use these details to prepare the demo and reply within one business day. No lists, no resale.
      </p>
    </form>
  );
}
