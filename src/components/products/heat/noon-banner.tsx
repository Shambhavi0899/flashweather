'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

import { onScrollFrame } from '@/lib/scroll';

import { planningImage } from './content';

/** The afternoon the banner scrubs through, in minutes past midnight. */
const FROM = 12 * 60;
const TO = 16 * 60;
const HOURS = ['12:00', '13:00', '14:00', '15:00', '16:00'];

/** Where on the screen the scrub starts (the banner's top) and ends (its bottom). */
const START = 0.85;
const END = 0.5;

const clockOf = (t: number) => {
  // To the nearest 5 minutes, so the readout ticks rather than flickers.
  const minutes = Math.round((FROM + t * (TO - FROM)) / 5) * 5;
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
};

/**
 * The "noon call" photo banner: the plan is made at noon, the sensor makes
 * the policy call at 4 pm. As the banner passes through view the scroll
 * scrubs a clock from 12:00 to 16:00 along its bottom (`--hn-t`, 0 → 1, on
 * the shared scroll loop so it moves with Lenis). The light warms and the
 * shadows lengthen with it (styles/heat-decision.css); the forecast chip
 * lands at 12:00 and the sensor chip at 16:00.
 *
 * The markup is 16:00 with both chips showing: that is the frame reduced
 * motion and a browser without JavaScript see.
 */
export function NoonBanner() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [noon, four] = [...root.querySelectorAll<HTMLElement>('.hn-chip')];
    const time = root.querySelector<HTMLElement>('.hn-time');

    let last = -1;
    const read = () => {
      const vh = window.innerHeight;
      const box = root.getBoundingClientRect();
      // 0 as the banner's top reaches START, 1 as its bottom reaches END.
      const raw = (vh * START - box.top) / (vh * (START - END) + box.height);
      const t = Math.min(1, Math.max(0, raw));
      noon.toggleAttribute('data-on', raw > 0);
      four.toggleAttribute('data-on', t >= 0.99);
      if (Math.abs(t - last) < 0.001) return;
      last = t;
      root.style.setProperty('--hn-t', t.toFixed(3));
      if (time) time.textContent = clockOf(t);
    };

    root.setAttribute('data-armed', '');
    const stop = onScrollFrame(read);
    return () => {
      stop();
      root.removeAttribute('data-armed');
      root.style.removeProperty('--hn-t');
      noon.removeAttribute('data-on');
      four.removeAttribute('data-on');
      if (time) time.textContent = HOURS[HOURS.length - 1];
    };
  }, []);

  return (
    <div
      ref={ref}
      className="hn relative isolate flex min-h-[280px] flex-col justify-between gap-8 overflow-hidden rounded-[20px] p-6 md:h-[340px] md:px-8 md:pt-[30px] md:pb-7"
    >
      <Image
        src={planningImage.src}
        alt={planningImage.alt}
        fill
        sizes="(min-width: 1440px) 1248px, 100vw"
        className="-z-20 object-cover"
      />
      <div aria-hidden className="hn-shade absolute inset-0 -z-10" />
      <div aria-hidden className="hn-warm absolute inset-0 -z-10" />
      <div aria-hidden className="products-photo-grade-38-90 absolute inset-0 -z-10" />
      <p className="text-micro font-bold tracking-[0.13em] text-viz-gold uppercase">Planning day · The noon call</p>
      <div className="flex flex-col gap-5">
        <p className="max-w-[1000px] text-[20px] leading-7 font-extrabold tracking-display text-white md:text-[22px] md:leading-body-l">
          The plan is made at noon. The sensor still makes the policy call at 4 pm.
        </p>
        <div className="flex flex-col gap-9">
          <p className="hn-chips">
            <span className="hn-chip hn-chip-forecast" data-on="">
              <span aria-hidden className="hn-chip-dot" />
              Plan made · Flash forecast 88.1 °F at 4 pm
            </span>
            <span className="hn-chip hn-chip-sensor" data-on="">
              <span aria-hidden className="hn-chip-dot" />
              Sensor reads the field · policy call
            </span>
          </p>
          <div aria-hidden>
            <div className="hn-track">
              <div className="hn-fill" />
              <div className="hn-run">
                <div className="hn-handle" />
                <span className="hn-time">{HOURS[HOURS.length - 1]}</span>
              </div>
            </div>
            <div className="hn-hours">
              {HOURS.map((hour, i) => (
                <span key={hour} className={i === 0 || i === HOURS.length - 1 ? undefined : 'hn-hour-mid'}>
                  {hour}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
