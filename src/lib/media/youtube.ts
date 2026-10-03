import { lowData } from './manager';

/**
 * The YouTube side of the players, in the part that loads with them. Nothing
 * here touches YouTube until a visitor reaches for a "Watch the full …"
 * button: on hover or focus, `warm()` opens connections to the embed's hosts
 * and fetches the lightbox's code; on click, `openYouTube()` opens the
 * lightbox (lib/media/lightbox.ts), which makes the iframe.
 *
 * The video servers themselves (rrN---sn-….googlevideo.com) are a different
 * host per viewer and per video, so there is nothing fixed to preconnect to;
 * the embed page reaches them itself. The IFrame Player API script is never
 * loaded: a plain embed already plays with sound and captions, and closing
 * the lightbox removes the iframe, which is all the API would do for us.
 */
const ORIGINS = ['https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://i.ytimg.com'];

let warmed = false;
const lightbox = () => import('./lightbox');

/** Connect to YouTube and fetch the lightbox ahead of a click. Once per page; never on Save-Data. */
export function warm() {
  if (warmed || lowData()) return;
  warmed = true;
  for (const href of ORIGINS) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = '';
    document.head.append(link);
  }
  void lightbox();
}

/** Open the full video in the site's one lightbox. */
export function openYouTube(video: { id: string; title: string; opener: HTMLElement }) {
  void lightbox().then(({ openLightbox }) => openLightbox(video));
}
