import { Motion } from '@/components/motion';

import { SectionHeader } from '../section-header';

/**
 * The Flash Mobile App's "What comes with the Flash mobile app?": the four
 * points arrive as push notifications on a phone's lock screen
 * (styles/mobile-app-lock-screen.css, mls-*).
 *
 * The screen is one <Motion> block, so the arrival plays when it scrolls in
 * (IntersectionObserver, no scroll listener of its own, so it keeps pace with
 * Lenis). Like a real lock screen the newest push lands on top and nudges the
 * rest down, so they arrive last to first, 500ms apart, and the stack ends in
 * reading order, 01 to 04. The markup is the finished stack, which is what
 * reduced motion and a browser without JavaScript see.
 *
 * The phone is drawn in one unit, 1/420 of its width, so the whole device
 * (bezel, clock, notifications) scales together, and its width is capped so
 * the full phone is never taller than 80% of the viewport.
 */

type Item = { title: string; body: string };

/** Drafted for this section; awaiting the user's approval. */
const INTRO =
  "Here's what the app brings, shown the way it reaches you: a push on your lock screen, before the storm does.";

/** The lock screen's clock. Decorative: a summer Saturday afternoon, storm season. */
const DATE = 'Saturday, June 13';
const TIME = '3:42';

export function MobileAppLockScreen({ label, heading, items }: { label: string; heading: string; items: Item[] }) {
  return (
    <section aria-labelledby="product-features-heading" className="mls border-t border-border bg-surface-sunken">
      <div className="mls-inner container-page">
        <div className="mls-copy">
          <SectionHeader
            id="product-features-heading"
            size="md"
            labelTone="muted-light"
            label={label}
            heading={heading}
          />
          <p className="mls-intro">{INTRO}</p>
        </div>

        <div className="mls-stage">
          <div className="mls-phone">
            <div className="mls-bezel">
              <Motion className="motion mls-screen" replay={false} threshold={0.55}>
                <div aria-hidden className="mls-island" />
                <StatusBar />
                <div aria-hidden className="mls-clock">
                  <p className="mls-date">{DATE}</p>
                  <p className="mls-time">{TIME}</p>
                </div>
                <ol className="mls-list">
                  {items.map((item, i) => (
                    <li key={item.title} className={`mls-row mls-r${i + 1}`}>
                      <div className="mls-drop">
                        <div className="mls-note">
                          <AppIcon />
                          <div className="mls-text">
                            <p aria-hidden className="mls-meta">
                              FLASH · now
                            </p>
                            <h3 className="mls-title">{item.title}</h3>
                            <p className="mls-body">{item.body}</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </Motion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The Flash app icon: the metallic bolt on a navy tile. */
function AppIcon() {
  return (
    <span aria-hidden className="mls-icon">
      <span className="mls-bolt bg-gold-metallic bolt-shape" />
    </span>
  );
}

/** Signal, Wi-Fi and battery, top right as on a lock screen. */
function StatusBar() {
  return (
    <div aria-hidden className="mls-status">
      <span className="mls-status-icons">
        <svg viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.6c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .7C5.2.7 2.6 1.8.7 3.6L2 5A8.7 8.7 0 0 1 8 2.6Z" />
          <path d="M8 6.2c1.3 0 2.5.5 3.4 1.3l1.3-1.4A6.8 6.8 0 0 0 8 4.3 6.8 6.8 0 0 0 3.3 6.1l1.3 1.4A5 5 0 0 1 8 6.2Z" />
          <path d="M8 12 10.1 9.8A3 3 0 0 0 8 8.9a3 3 0 0 0-2.1.9L8 12Z" />
        </svg>
        <span className="mls-battery">
          <span />
        </span>
      </span>
    </div>
  );
}
