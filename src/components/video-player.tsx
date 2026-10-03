'use client';

import { useEffect, useRef } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Logo } from '@/components/logo';
import { claim, type Media, settle, watch } from '@/lib/media/manager';
import { openYouTube, warm } from '@/lib/media/youtube';

/** The bar fades after the mouse has rested this long during playback. */
const IDLE_MS = 2500;
/** The blink on a toggle. */
const FLASH_MS = 400;
/** A stopped clip that has been out of view this long lets go of its video. */
const RELEASE_MS = 15000;

export type VideoClip = {
  /** The H.264 MP4, which every browser plays. */
  src: string;
  /** The same clip as VP9 WebM, smaller; offered first where it plays. */
  webm?: string;
  poster: string;
  captions: string;
  /** Seconds, for the timer before the metadata has loaded. */
  duration: number;
  /** The small tag at the top left, if the clip has one. */
  tag?: string;
  /** What the clip is, for assistive tech. */
  label: string;
  /**
   * For a highlight cut from a longer video: the full video on Flash's
   * channel, for the lightbox, and the words on the pill and the end screen
   * ("Watch the full story"). A clip that is the whole video has neither.
   */
  youtubeId?: string;
  cta?: string;
  /** A link on the end screen, such as "Book a demo", for a clip with no fuller video. */
  endLink?: { label: string; href: string };
  /** A line under the big play button on the poster, "Watch Flash in 90 seconds". */
  playLabel?: string;
  /**
   * A smaller line under it ("with Dave Downey, Lead Meteorologist"). With
   * one, the label is set as the poster's title, over a soft dark shade.
   */
  playNote?: string;
  /** The name and title shown over the clip, if the clip does not show its own. */
  name?: string;
  title?: string;
  /** The clip's own lower third runs this long; the name above waits for it to go. */
  lowerThirdUntil?: number;
};

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

const ICON = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
} as const;
const PlayIcon = ({ className }: { className?: string }) => (
  <svg {...ICON} className={className}>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />
  </svg>
);
const PauseIcon = ({ className }: { className?: string }) => (
  <svg {...ICON} className={className}>
    <path d="M8 5v14M16 5v14" strokeWidth="3" />
  </svg>
);
const ReplayIcon = () => (
  <svg {...ICON}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

/**
 * An inline clip with its own controls (styles/video-player.css). The home
 * page's tour row and proof section, the Command Center hero and the Why
 * Flash hero share it; `onDark` adds the thin border a card has on a navy
 * section, and `appWindow` frames the clip as an app window instead (a slim
 * title bar with three dots and the Flash logo, a gold edge, a soft glow).
 *
 * Nothing plays by itself: the poster, with a big gold play button, waits
 * for a click, and the clip then plays with sound. A click or tap anywhere
 * on the picture plays or pauses, with a blink of the icon; so do Space and
 * K with the picture focused, M mutes, F goes fullscreen, C toggles the
 * captions. Only one thing plays at a time (lib/media/manager.ts): starting
 * a clip, or opening the lightbox, pauses whatever was playing. A clip that
 * has scrolled mostly off screen pauses and stays paused until it is played
 * again.
 *
 * Loading: nothing of the clip is fetched before a click. The sources and
 * the captions track carry their addresses as `data-src` and get them on
 * the first play, WebM (VP9) first and MP4 (H.264) after it; the poster is
 * an optimised <Image> (AVIF or WebP at the card's width), lazy unless
 * `preloadPoster` (a hero's poster, the page's largest paint). A clip that
 * is stopped and has been out of view for a while lets go of its video, and
 * picks up where it was when played again.
 *
 * When the clip ends an end screen offers Replay and, for a highlight cut
 * from a longer video, "Watch the full …", which opens that video in the
 * site's one lightbox (lib/media/lightbox.ts, loaded on first use; hovering
 * or focusing the button connects to YouTube ahead of the click). A whole
 * video offers its `endLink` instead. Nothing loops. Captions are off until
 * the CC button turns them on; the script draws the current cue itself, so
 * they look the same in every browser. The clip's own lower third, if it has
 * one, names the speaker for its first seconds; ours fades in once it has
 * gone.
 */
export function VideoPlayer({
  clip,
  onDark = false,
  appWindow = false,
  sizes = '(min-width: 1440px) 720px, (min-width: 1024px) 57vw, 100vw',
  preloadPoster = false,
}: {
  clip: VideoClip;
  onDark?: boolean;
  appWindow?: boolean;
  /** The poster's rendered width, for its srcset. */
  sizes?: string;
  /** Fetch the poster first thing: for a hero, whose poster is the largest paint. */
  preloadPoster?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    const video = root?.querySelector('video');
    if (!root || !video) return;
    const q = <T extends Element>(s: string) => root.querySelector<T>(s)!;
    const frame = q<HTMLElement>('.vp-frame');
    const hit = q<HTMLElement>('.vp-hit');
    const seek = q<HTMLInputElement>('.vp-seek');
    const time = q<HTMLElement>('.vp-time');
    const caption = q<HTMLElement>('.vp-caption');
    const cc = q<HTMLButtonElement>('[data-vp="cc"]');
    const sound = q<HTMLButtonElement>('[data-vp="sound"]');
    const playBtn = q<HTMLButtonElement>('[data-vp="play"]');
    const sources = [...video.querySelectorAll('source')];
    const trackEl = video.querySelector('track');
    const track = video.textTracks[0];

    video.removeAttribute('controls');
    video.muted = false;

    let idle = 0;
    let flash = 0;
    let release = 0;
    /** The sources are attached. */
    let loaded = false;
    /** Where a released clip picks up. */
    let resumeAt = 0;

    const now = () => (loaded ? video.currentTime : resumeAt);
    const duration = () => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : clip.duration);
    const paint = () => {
      const d = duration();
      const t = now();
      time.textContent = `${fmt(t)} / ${fmt(d)}`;
      seek.value = String(t);
      seek.max = String(d);
      seek.style.setProperty('--vp-at', `${(t / d) * 100}%`);
      seek.setAttribute('aria-valuetext', `${fmt(t)} of ${fmt(d)}`);
      root.toggleAttribute('data-lower', t >= (clip.lowerThirdUntil ?? 0));
    };
    const onCue = () => {
      const cue = track?.activeCues?.[0] as VTTCue | undefined;
      caption.textContent = cue ? cue.text : '';
    };
    // The picture and the bar's button both say what a press will do.
    const label = () => {
      const what = video.paused ? 'Play video' : 'Pause video';
      hit.setAttribute('aria-label', what);
      playBtn.setAttribute('aria-label', what);
    };

    // The first play attaches the sources and the captions; nothing is fetched before.
    const attach = () => {
      if (loaded) return;
      loaded = true;
      for (const source of sources) source.src = source.dataset.src!;
      if (trackEl && !trackEl.getAttribute('src')) trackEl.src = trackEl.dataset.src!;
      if (track) track.mode = 'hidden';
      video.preload = 'auto';
      video.load();
      if (resumeAt) {
        const at = resumeAt;
        video.currentTime = at;
        video.addEventListener('loadedmetadata', () => (video.currentTime = at), { once: true });
      }
    };
    // Let go of the video (its buffer and decoder): the poster comes back.
    const detach = () => {
      if (!loaded || !video.paused) return;
      resumeAt = root.hasAttribute('data-ended') ? 0 : video.currentTime;
      loaded = false;
      for (const source of sources) source.removeAttribute('src');
      video.preload = 'none';
      video.load();
      root.removeAttribute('data-started');
      paint();
    };
    // play() is called inside the click, so the browser lets it play with sound.
    const play = () => {
      attach();
      root.removeAttribute('data-ended');
      return video.play().catch(() => {});
    };
    const me: Media = { pause: () => video.pause() };

    const blink = (what: 'play' | 'pause') => {
      root.removeAttribute('data-flash');
      void root.offsetWidth;
      root.setAttribute('data-flash', what);
      clearTimeout(flash);
      flash = window.setTimeout(() => root.removeAttribute('data-flash'), FLASH_MS);
    };
    const toggle = () => {
      if (video.paused) {
        play();
        blink('play');
      } else {
        video.pause();
        blink('pause');
      }
    };
    const replay = () => {
      resumeAt = 0;
      if (loaded) video.currentTime = 0;
      play();
    };
    const toggleCc = () => {
      const on = !root.hasAttribute('data-cc');
      root.toggleAttribute('data-cc', on);
      cc.setAttribute('aria-pressed', String(on));
    };
    const toggleSound = () => {
      video.muted = !video.muted;
      root.toggleAttribute('data-muted', video.muted);
      sound.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute');
    };
    const fullscreen = () => {
      const v = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
      if (document.fullscreenElement) document.exitFullscreen();
      else if (frame.requestFullscreen) frame.requestFullscreen();
      else v.webkitEnterFullscreen?.();
    };
    const openFull = (button: HTMLElement) => {
      if (!clip.youtubeId) return;
      video.pause();
      openYouTube({ id: clip.youtubeId, title: clip.label, opener: button });
    };

    // Mostly off the screen: pause, and stay paused; stopped and away for a while: let go.
    const unwatch = watch(frame, (visible) => {
      clearTimeout(release);
      if (visible) return;
      if (!video.paused) video.pause();
      release = window.setTimeout(detach, RELEASE_MS);
    });

    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('[data-vp]');
      if (!button) return;
      switch (button.dataset.vp) {
        case 'hit':
        case 'play':
          toggle();
          break;
        case 'replay':
          replay();
          break;
        case 'sound':
          toggleSound();
          break;
        case 'cc':
          toggleCc();
          break;
        case 'full':
          fullscreen();
          break;
        case 'open':
          openFull(button);
          break;
      }
    };
    // Reaching for "Watch the full …": connect to YouTube and fetch the lightbox.
    const onReach = (event: Event) => {
      if ((event.target as HTMLElement).closest('[data-vp="open"]')) warm();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.target !== hit) return;
      const key = event.key.toLowerCase();
      if (key === ' ' || key === 'k' || key === 'enter') toggle();
      else if (key === 'm') toggleSound();
      else if (key === 'f') fullscreen();
      else if (key === 'c') toggleCc();
      else return;
      event.preventDefault();
    };
    // The bar fades once the mouse has rested during playback.
    const onMove = () => {
      root.removeAttribute('data-idle');
      clearTimeout(idle);
      idle = window.setTimeout(() => root.setAttribute('data-idle', ''), IDLE_MS);
    };
    const onLeave = () => {
      clearTimeout(idle);
      root.setAttribute('data-idle', '');
    };
    const onSeek = () => {
      const t = Number(seek.value);
      if (loaded) video.currentTime = t;
      else resumeAt = t;
      root.removeAttribute('data-ended');
      paint();
    };
    const onPlay = () => {
      root.setAttribute('data-playing', '');
      label();
      claim(me);
    };
    const onPlaying = () => root.setAttribute('data-started', '');
    const onPause = () => {
      root.removeAttribute('data-playing');
      root.removeAttribute('data-idle');
      label();
      settle(me);
    };
    const onEnded = () => {
      root.setAttribute('data-ended', '');
      root.querySelector<HTMLElement>('.vp-end [data-vp], .vp-end a')?.focus({ preventScroll: true });
    };

    root.addEventListener('click', onClick);
    root.addEventListener('pointerover', onReach);
    root.addEventListener('focusin', onReach);
    root.addEventListener('keydown', onKey);
    frame.addEventListener('pointermove', onMove);
    frame.addEventListener('pointerleave', onLeave);
    seek.addEventListener('input', onSeek);
    video.addEventListener('timeupdate', paint);
    video.addEventListener('loadedmetadata', paint);
    video.addEventListener('play', onPlay);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    track?.addEventListener('cuechange', onCue);
    paint();
    label();

    return () => {
      unwatch();
      clearTimeout(idle);
      clearTimeout(flash);
      clearTimeout(release);
      settle(me);
      root.removeEventListener('click', onClick);
      root.removeEventListener('pointerover', onReach);
      root.removeEventListener('focusin', onReach);
      root.removeEventListener('keydown', onKey);
      frame.removeEventListener('pointermove', onMove);
      frame.removeEventListener('pointerleave', onLeave);
      seek.removeEventListener('input', onSeek);
      video.removeEventListener('timeupdate', paint);
      video.removeEventListener('loadedmetadata', paint);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      track?.removeEventListener('cuechange', onCue);
      video.pause();
      video.setAttribute('controls', '');
    };
  }, [clip]);

  const {
    src,
    webm,
    poster,
    captions,
    duration,
    tag,
    label,
    youtubeId,
    cta,
    endLink,
    playLabel,
    playNote,
    name,
    title,
  } = clip;
  const full = youtubeId && cta ? cta : undefined;
  const frame = (
    <div className="vp-frame">
      {/* The addresses wait in data-src until the first play (see above). */}
      <video className="vp-video" controls playsInline preload="none" aria-label={label}>
        {webm && <source data-src={webm} type='video/webm; codecs="vp9, opus"' />}
        <source data-src={src} type="video/mp4" />
        <track kind="captions" srcLang="en" label="English" data-src={captions} />
      </video>
      {/* The poster, shown at once and faded out as the clip starts moving. */}
      <Image
        className="vp-poster"
        src={poster}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        quality={75}
        preload={preloadPoster}
      />
      {playNote && <span aria-hidden className="vp-shade" />}

      <div role="button" tabIndex={0} data-vp="hit" className="vp-hit" aria-label="Play video" />

      <span aria-hidden className="vp-flash">
        <PlayIcon className="vp-flash-play" />
        <PauseIcon className="vp-flash-pause" />
      </span>
      {/* The big play button over a clip that is not playing, and its line,
          or its title and the note under it. */}
      <span aria-hidden className="vp-big">
        <span className="vp-big-disc">
          <PlayIcon />
        </span>
        {playLabel &&
          (playNote ? (
            <span className="vp-big-label vp-big-titled">
              <span className="vp-big-title">{playLabel}</span>
              <span className="vp-big-note">{playNote}</span>
            </span>
          ) : (
            <span className="vp-big-label">{playLabel}</span>
          ))}
      </span>

      <div className="vp-top">
        {tag && <span className="vp-tag">{tag}</span>}
        {full && (
          <button type="button" data-vp="open" className="vp-cta">
            {full} <span aria-hidden>↗</span>
          </button>
        )}
      </div>

      <div className="vp-bottom">
        <p className="vp-caption" aria-live="off" />
        {name && (
          <p className="vp-lower" aria-hidden>
            <span className="vp-lower-name">{name}</span>
            <span className="vp-lower-title">{title}</span>
          </p>
        )}
        <div className="vp-bar">
          <button type="button" data-vp="play" className="vp-btn" aria-label="Play video">
            <PlayIcon className="vp-icon-play" />
            <PauseIcon className="vp-icon-pause" />
          </button>
          <span className="vp-time">0:00 / {fmt(duration)}</span>
          <input
            type="range"
            className="vp-seek"
            min="0"
            max={duration}
            step="0.1"
            defaultValue="0"
            aria-label="Seek"
          />
          <button type="button" data-vp="cc" className="vp-btn" aria-label="Captions" aria-pressed="false">
            <svg {...ICON}>
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M10.5 10.2a2 2 0 1 0 0 3.6M17 10.2a2 2 0 1 0 0 3.6" />
            </svg>
          </button>
          <button type="button" data-vp="sound" className="vp-btn" aria-label="Mute">
            <svg {...ICON} className="vp-icon-sound">
              <path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
            </svg>
            <svg {...ICON} className="vp-icon-muted">
              <path d="M4 9v6h4l5 4V5L8 9zM16 9l5 6M21 9l-5 6" />
            </svg>
          </button>
          <button type="button" data-vp="full" className="vp-btn" aria-label="Fullscreen">
            <svg {...ICON}>
              <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
            </svg>
          </button>
        </div>
      </div>

      {/* The end screen: replay, and the full video or the page's next step. */}
      <div className="vp-end">
        {full && (
          <button type="button" data-vp="open" className="vp-end-btn vp-end-primary">
            {full} <span aria-hidden>↗</span>
          </button>
        )}
        {endLink && (
          <Link href={endLink.href} className="vp-end-btn vp-end-primary">
            {endLink.label}
          </Link>
        )}
        <button type="button" data-vp="replay" className="vp-end-btn">
          <ReplayIcon /> Replay
        </button>
      </div>
    </div>
  );

  return (
    <figure ref={ref} className={`vp ${onDark ? 'vp-on-dark' : ''} ${appWindow ? 'vp-window' : ''}`}>
      {appWindow ? (
        <div className="vp-shell">
          <div aria-hidden className="vp-shell-bar">
            <span className="vp-shell-dots">
              <span />
              <span />
              <span />
            </span>
            <Logo variant="dark" size="bar" link={false} alt="" />
          </div>
          {frame}
        </div>
      ) : (
        frame
      )}
    </figure>
  );
}
