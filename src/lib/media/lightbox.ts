import { lockScroll } from '@/lib/scroll';

import { claim, type Media, settle } from './manager';

/**
 * The site's one YouTube lightbox, loaded on first use (lib/media/youtube.ts)
 * and built once: a <dialog> on <body> (styles/video-player.css, `vp-dialog`)
 * that takes the video id when it opens.
 *
 * Opening it claims the stage from the media manager, so any clip playing
 * pauses; the iframe (youtube-nocookie, playing with sound, captions on, no
 * related videos from other channels) is made then. The page is held still
 * while it is open. As a modal <dialog> it keeps focus inside it and leaves
 * the page inert; Escape and the backdrop close it, as does the close button,
 * which takes focus on opening. Closing removes the iframe entirely, which
 * stops the sound and frees the player, and gives focus back to the button
 * that opened it.
 */

let dialog: HTMLDialogElement | null = null;
let frame: HTMLElement;
let opener: HTMLElement | null = null;
let unlock: (() => void) | undefined;

const media: Media = { pause: () => dialog?.close() };

function build() {
  const box = document.createElement('dialog');
  box.className = 'vp-dialog';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'vp-close';
  close.setAttribute('aria-label', 'Close');
  close.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  close.addEventListener('click', () => box.close());

  frame = document.createElement('div');
  frame.className = 'vp-dialog-frame';

  box.append(close, frame);
  // The backdrop is the dialog itself, outside its frame.
  box.addEventListener('click', (event) => {
    if (event.target === box) box.close();
  });
  box.addEventListener('close', () => {
    frame.replaceChildren();
    unlock?.();
    unlock = undefined;
    settle(media);
    opener?.focus();
    opener = null;
  });
  document.body.append(box);
  dialog = box;
  return box;
}

export function openLightbox({ id, title, opener: from }: { id: string; title: string; opener: HTMLElement }) {
  const box = dialog ?? build();
  if (box.open) return;
  opener = from;
  claim(media);

  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    cc_load_policy: '1',
    cc_lang_pref: 'en',
  });
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${params}`;
  iframe.title = title;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  frame.replaceChildren(iframe);
  box.setAttribute('aria-label', title);

  unlock = lockScroll();
  box.showModal();
  box.querySelector<HTMLElement>('.vp-close')?.focus();
}
