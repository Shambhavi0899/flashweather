'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import { StepOverlay } from '@/components/home/how-overlays';
import { Motion } from '@/components/motion';
import { onScrollFrame, scrollToCentre } from '@/lib/scroll';

type Step = { title: string; body: string; image: { src: string; alt: string } };

/**
 * When the timeline runs: desktop widths, for people who take motion. The
 * same query switches the layout in styles/home.css, so the two must match.
 * Everywhere else the steps are static stacked cards and this file only
 * supplies the markup.
 */
const TIMELINE = '(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)';

const subscribe = (notify: () => void) => {
  const query = window.matchMedia(TIMELINE);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
const matches = () => window.matchMedia(TIMELINE).matches;

const pad = (n: number) => String(n).padStart(2, '0');

const clamp = (n: number, max: number) => Math.min(max, Math.max(0, n));

/** How far the photo drifts, end to end, while its panel is stuck. */
const DRIFT = 24;

/**
 * "How it works" as a scroll-driven timeline. The page scrolls normally: each
 * step is half a viewport tall, the photo panel is sticky and centred, and
 * the step crossing the middle of the viewport is the active one, so its
 * text sits centred against the photo. The gold line runs from the first
 * badge to the last and reaches each badge as its step turns active.
 */
export function HowTimeline({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const live = useSyncExternalStore(subscribe, matches, () => false);

  useEffect(() => {
    const root = ref.current;
    const list = root?.querySelector<HTMLElement>('.how-steps');
    const panel = root?.querySelector<HTMLElement>('.how-panel');
    if (!live || !root || !list || !panel) return;

    const badges = root.querySelectorAll<HTMLElement>('.how-badge');
    const rail = panel.parentElement;
    const first = list.firstElementChild;
    if (!badges.length || !rail || !first) return;

    const measure = () => {
      const centre = (rect: DOMRect) => rect.top + rect.height / 2;
      const from = centre(badges[0].getBoundingClientRect());
      const to = centre(badges[badges.length - 1].getBoundingClientRect());
      root.style.setProperty('--how-line-top', `${(from - root.getBoundingClientRect().top).toFixed(1)}px`);
      root.style.setProperty('--how-line-height', `${(to - from).toFixed(1)}px`);

      // A step is active while the middle of the viewport is inside it. The
      // line is filled by the same distance, so its tip meets each badge as
      // the step turns active.
      const step = first.getBoundingClientRect();
      const travelled = window.innerHeight / 2 - step.top;
      root.style.setProperty('--how-fill', clamp(travelled / (to - from), 1).toFixed(4));
      setActive(clamp(Math.floor(travelled / step.height), steps.length - 1));

      // The photo drifts a few pixels against the scroll while it is stuck.
      const rest = parseFloat(getComputedStyle(panel).top) || 0;
      const track = rail.getBoundingClientRect();
      const stuck = clamp((rest - track.top) / (track.height - panel.offsetHeight), 1);
      root.style.setProperty('--how-drift', `${((0.5 - stuck) * DRIFT).toFixed(2)}px`);
    };

    // On the shared scroll frame, so it keeps step with smooth scrolling.
    const stopReading = onScrollFrame(measure);
    return () => {
      stopReading();
      for (const name of ['--how-line-top', '--how-line-height', '--how-fill', '--how-drift']) {
        root.style.removeProperty(name);
      }
      setActive(0);
    };
  }, [live, steps.length]);

  // A step is half a viewport tall; centred, its text is level with the photo.
  const goTo = (step: number) => {
    const target = ref.current?.querySelectorAll('.how-step')[step];
    if (target) scrollToCentre(target);
  };

  return (
    <div ref={ref} className="how">
      <ol className="how-steps">
        {steps.map((step, i) => (
          <Motion as="li" key={step.title} className="motion how-step" replay={false}>
            <div className="how-step-shot">
              <Image
                src={step.image.src}
                alt={step.image.alt}
                fill
                sizes="(min-width: 1440px) 720px, (min-width: 1024px) 58vw, (min-width: 480px) 50vw, 100vw"
                className="object-cover"
              />
              <span aria-hidden className="home-step-grade absolute inset-0" />
              <StepOverlay step={i} />
            </div>
            <span
              aria-hidden
              className="how-badge"
              data-state={i === active ? 'active' : i < active ? 'done' : undefined}
            >
              {pad(i + 1)}
            </span>
            <div className="how-step-copy" aria-current={live && i === active ? 'step' : undefined}>
              <h3 className="how-step-title">
                {live ? (
                  <button type="button" className="how-step-link" onClick={() => goTo(i)}>
                    {step.title}
                  </button>
                ) : (
                  step.title
                )}
              </h3>
              <p className="how-step-body">{step.body}</p>
            </div>
          </Motion>
        ))}
      </ol>

      <span aria-hidden className="how-line">
        <span className="how-line-fill bg-gold-metallic" />
      </span>

      <div aria-hidden className="how-panel-rail">
        <Motion className="motion how-panel" replay={false}>
          {steps.map((step, i) => (
            <div key={step.title} className="how-shot" data-on={i === active ? '' : undefined}>
              <div className="how-shot-drift">
                <Image src={step.image.src} alt="" fill sizes="(min-width: 1024px) 125vh, 1px" className="object-cover" />
                <StepOverlay step={i} />
              </div>
              <span className="home-step-grade absolute inset-0" />
            </div>
          ))}
          <p className="how-count" data-step={active}>
            <span>STEP</span>
            <span className="how-count-window">
              <span className="how-count-roll">
                {steps.map((step, i) => (
                  <span key={step.title}>{pad(i + 1)}</span>
                ))}
              </span>
            </span>
            <span>of {pad(steps.length)}</span>
          </p>
        </Motion>
      </div>
    </div>
  );
}
