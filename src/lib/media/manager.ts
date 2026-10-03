/**
 * The site's media manager: one store for everything that plays sound, the
 * inline clips (components/video-player.tsx) and the YouTube lightbox
 * (lib/media/lightbox.ts).
 *
 *   one at a time   whatever starts claims the stage; what was playing
 *                   before is paused. Players do not listen to each other.
 *   in view         one IntersectionObserver for every player on the page,
 *                   not one each; a player hears when its frame goes in or
 *                   out of view (half of it on screen).
 *   low data        Save-Data on, or a 2G-class connection: nothing is
 *                   fetched ahead of a click (lib/media/youtube.ts).
 */

export type Media = { pause: () => void };

let playing: Media | null = null;

/** `media` has started: whatever else was playing pauses. */
export function claim(media: Media) {
  if (playing && playing !== media) playing.pause();
  playing = media;
}

/** `media` has stopped (paused, ended or closed). */
export function settle(media: Media) {
  if (playing === media) playing = null;
}

/** At least this much of a frame on screen counts as in view. */
export const IN_VIEW = 0.5;

type Watcher = (visible: boolean) => void;
const watchers = new Map<Element, Watcher>();
let observer: IntersectionObserver | null = null;

/** Calls `onChange` as `el` goes in and out of view; returns the unwatch. */
export function watch(el: Element, onChange: Watcher) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) watchers.get(entry.target)?.(entry.intersectionRatio >= IN_VIEW);
    },
    { threshold: [0, IN_VIEW] },
  );
  watchers.set(el, onChange);
  observer.observe(el);
  return () => {
    watchers.delete(el);
    observer?.unobserve(el);
    if (!watchers.size) {
      observer?.disconnect();
      observer = null;
    }
  };
}

type Connection = { saveData?: boolean; effectiveType?: string };

/** Save-Data is on, or the connection is 2G-class. */
export function lowData() {
  const connection = (navigator as Navigator & { connection?: Connection }).connection;
  return !!connection && (connection.saveData === true || /(^|-)2g$/.test(connection.effectiveType ?? ''));
}
