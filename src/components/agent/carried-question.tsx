'use client';

import { useSyncExternalStore } from 'react';

/** Long enough for any example question; anything longer is cut, not shown whole. */
const MAX = 140;

const noop = () => () => {};
const read = () => new URLSearchParams(window.location.search).get('q')?.trim().slice(0, MAX) || null;

/**
 * The text in the agent hero's ask bar (the shared conversation's composer
 * placeholder, which sets the size and the muted colour). A link from elsewhere on the site
 * (the Hail spec banner's typing bar) can carry the question it was showing
 * as ?q=, and the bar shows that question instead of its placeholder. The
 * query is only ever displayed, as text; the page and its canonical are the
 * same with or without it.
 */
export function CarriedQuestion({ placeholder }: { placeholder: string }) {
  const question = useSyncExternalStore(noop, read, () => null);
  return <span className={question ? 'text-text-on-dark' : undefined}>{question ?? placeholder}</span>;
}
