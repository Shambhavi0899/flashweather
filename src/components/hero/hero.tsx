import { Fragment } from 'react';

import { Tilt } from '@/components/tilt';

import { HeroMotion } from './hero-motion';

/**
 * The hero every page opens on. It is the page's first section and carries
 * the motion they all share (styles/hero.css): the load choreography, which
 * is CSS and starts on the first paint, and the ambient layer, from
 * <HeroMotion> and <Tilt>. Reduced motion shows the finished hero, still.
 *
 * `theme` is the ground the hero opens on, as `data-theme`. The page's
 * <SiteHeader tone> has to be the same, so the fixed header matches the hero
 * it sits over from the first paint; `npm run seo` fails a page where the
 * two differ.
 */
export function HeroSection({
  as: Tag = 'section',
  theme,
  className,
  labelledBy,
  children,
}: {
  as?: 'section' | 'header';
  theme: 'dark' | 'light';
  className: string;
  /** The id of the hero's h1. */
  labelledBy?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag data-hero data-theme={theme} aria-labelledby={labelledBy} className={className}>
      <Tilt className="contents">
        <HeroMotion>{children}</HeroMotion>
      </Tilt>
    </Tag>
  );
}

/**
 * The hero's background photo: pass the <Image fill>. Scroll parallax is on
 * the outer box and mouse parallax and the 1.08 → 1 zoom on the inner one,
 * so each transform runs on its own timing; the box bleeds 16px so neither
 * shows an edge. `storm` adds the lightning layer, for a photo of a storm
 * sky. `layer` is the z-index class the photo had.
 */
export function HeroBackground({
  storm = false,
  layer = '',
  children,
}: {
  storm?: boolean;
  layer?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={`hero-bg-scroll absolute -inset-4 ${layer}`}>
        <div className="hero-bg absolute inset-0">{children}</div>
      </div>
      {storm && <div aria-hidden className={`hero-flash absolute inset-0 ${layer}`} />}
    </>
  );
}

/** The headline rises in eight steps at most, 60ms apart. */
const STEPS = 8;

/**
 * A hero headline's text, a word at a time: each word rises 60ms after the
 * one before. A headline of more than eight words shares the eight steps
 * between its words, in order, so a long one lands as soon as a short one.
 *
 * `gold` is the run of words, as it appears in the text, set in the gold of
 * the hero's ground; gold words get the shimmer. An array of texts is a
 * headline in lines, each in a `lineClass` span.
 */
export function HeroWords({
  text,
  gold,
  tone = 'dark',
  lineClass = '',
}: {
  text: string | string[];
  gold?: string;
  tone?: 'dark' | 'light';
  lineClass?: string;
}) {
  const lines = (Array.isArray(text) ? text : [text]).map((line) => line.split(/\s+/).filter(Boolean));
  const words = lines.flat();
  const step = (i: number) => (words.length <= STEPS ? i : Math.round((i * (STEPS - 1)) / (words.length - 1)));

  const goldWords = gold?.split(/\s+/).filter(Boolean) ?? [];
  const goldFrom = goldWords.length
    ? words.findIndex((_, i) => goldWords.every((word, n) => words[i + n] === word))
    : -1;
  const isGold = (i: number) => goldFrom >= 0 && i >= goldFrom && i < goldFrom + goldWords.length;
  const goldClass = tone === 'dark' ? 'text-gold-metallic' : 'text-gold-on-light';

  let index = 0;
  const rendered = lines.map((line, l) => {
    const spans = line.map((word) => {
      const i = index++;
      return (
        <Fragment key={i}>
          <span className={`hero-word hero-word-${step(i)} ${isGold(i) ? goldClass : ''}`}>{word}</span>{' '}
        </Fragment>
      );
    });
    return Array.isArray(text) ? (
      <span key={l} className={lineClass}>
        {spans}
      </span>
    ) : (
      spans
    );
  });

  return <>{rendered}</>;
}
