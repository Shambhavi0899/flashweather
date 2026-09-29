'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { Motion } from '@/components/motion';
import type { RoleCard } from '@/content/products';

/** How long a mouse has to rest on a role before it opens. */
const HOVER_MS = 140;

/**
 * "Which part of the platform should you start with?" as a role picker: the
 * roles are tabs (a list on wide screens, a row of chips below 1024px) and
 * each opens a panel over its photo that draws the path from the product to
 * Flash Agent to the tool the role already lives in.
 *
 * The motion is CSS (styles/products.css, "Role picker"), on the shared
 * .motion system, so it waits until the block scrolls in and, with reduced
 * motion or no JavaScript, shows the finished frame:
 *   path          on the open panel the gold line draws node to node in
 *                 900ms and each node pops as the line reaches it; a panel
 *                 redraws each time it opens
 *   auto-advance  the open role's bar fills over 6s and, when it ends, the
 *                 next role opens. It holds while the block is off screen,
 *                 hovered or has focus, so nothing moves under the reader.
 *                 With reduced motion there is no bar and no advance.
 *
 * Every panel is in the markup; the closed ones are hidden with CSS, so
 * their copy and links are still in the page for crawlers.
 */
export function RolePicker({ roles }: { roles: RoleCard[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const list = useRef<HTMLDivElement>(null);
  const hover = useRef(0);
  const base = useId();

  useEffect(() => () => clearTimeout(hover.current), []);

  const open = (index: number, focus = false) => {
    const next = (index + roles.length) % roles.length;
    setActive(next);
    const tab = tabs.current[next];
    if (!tab) return;
    if (focus) tab.focus();
    // Below 1024px the roles are a row of chips: bring the open one into
    // the row, without moving the page.
    const row = list.current;
    if (row && row.scrollWidth > row.clientWidth) {
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      row.scrollTo({
        left: tab.offsetLeft - (row.clientWidth - tab.offsetWidth) / 2,
        behavior: still ? 'auto' : 'smooth',
      });
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (step) open(active + step, true);
    else if (event.key === 'Home') open(0, true);
    else if (event.key === 'End') open(roles.length - 1, true);
    else return;
    event.preventDefault();
  };

  const tabId = (i: number) => `${base}-tab-${i}`;
  const panelId = (i: number) => `${base}-panel-${i}`;

  return (
    <Motion replay={false} threshold={0.3} className="motion role-picker">
      <div ref={list} role="tablist" aria-label="Roles" className="role-tabs" onKeyDown={onKeyDown}>
        {roles.map((role, i) => (
          <button
            key={role.role}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={tabId(i)}
            aria-selected={i === active}
            aria-controls={panelId(i)}
            tabIndex={i === active ? 0 : -1}
            className="role-tab"
            onClick={() => open(i)}
            onPointerEnter={(event) => {
              if (event.pointerType !== 'mouse') return;
              clearTimeout(hover.current);
              hover.current = window.setTimeout(() => open(i), HOVER_MS);
            }}
            onPointerLeave={() => clearTimeout(hover.current)}
          >
            <span className="role-thumb">
              <Image src={role.image.src} alt="" fill sizes="56px" className="object-cover" />
            </span>
            <span className="role-tab-label">{role.role}</span>
            <span
              aria-hidden
              className="role-progress"
              onAnimationEnd={(event) => {
                if (event.animationName === 'role-progress') open(i + 1);
              }}
            />
          </button>
        ))}
      </div>

      <div className="role-stage">
        {roles.map((role, i) => (
          <div
            key={role.role}
            role="tabpanel"
            id={panelId(i)}
            aria-labelledby={tabId(i)}
            data-on={i === active ? '' : undefined}
            className="role-panel"
          >
            <div className="role-bg">
              <Image
                src={role.image.src}
                alt={role.image.alt}
                fill
                sizes="(min-width: 1440px) 810px, (min-width: 1024px) 62vw, 100vw"
                className="object-cover"
              />
            </div>
            <span aria-hidden className="role-grade" />

            <div className="role-panel-body">
              <div className="flex flex-col gap-2">
                <p className="text-[10px] leading-3 font-extrabold tracking-[0.13em] text-viz-gold uppercase">If you are</p>
                <h3 className="text-[26px] leading-8 font-extrabold tracking-[-0.03em] text-text-on-dark md:text-h2 md:leading-h2">
                  {role.role}
                </h3>
              </div>

              <ol className="role-path">
                <li className="role-node">
                  <span aria-hidden className="role-marker">
                    <span className="role-dot" />
                  </span>
                  <span aria-hidden className="role-segment" />
                  <div className="role-node-body">
                    <p className="role-node-label">Start with</p>
                    <ul className="flex flex-wrap gap-2">
                      {role.startWith.map((link) => (
                        <li key={link.href}>
                          <Link href={link.href} className="role-chip role-chip-link pc-link">
                            {link.label} <span aria-hidden>→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                <li className="role-node">
                  <span aria-hidden className="role-marker role-marker-bolt">
                    <span className="role-bolt bolt-shape bg-gold-metallic" />
                  </span>
                  <span aria-hidden className="role-segment" />
                  <div className="role-node-body">
                    <p className="role-node-label">Then add Flash Agent</p>
                  </div>
                </li>
                <li className="role-node">
                  <span aria-hidden className="role-marker">
                    <span className="role-dot" />
                  </span>
                  <div className="role-node-body">
                    <p className="role-node-label">In your tool</p>
                    <p className="role-chip role-chip-tool">{role.tool}</p>
                    <p className="text-body-s leading-[21px] text-text-on-dark-muted">{role.action}</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        ))}
      </div>
    </Motion>
  );
}
