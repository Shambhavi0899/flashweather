'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';

import { BOLT_PATH } from '@/components/bolt-path';
import { Motion } from '@/components/motion';
import type { Product } from '@/content/products';

import { WindowFrame } from './command-center-window';

/**
 * "Products that pair with Weather Command Center" as layers on one screen:
 * a mini Command Center (the page's screenshot, cropped to its map and
 * dimmed) beside the product cards, each card with an "Add layer" switch.
 * Hovering or clicking a card switches its layer on; the switch turns it on
 * and off. Layers stack.
 *
 *   Lightning Suite   glowing strike-risk areas over the storm cells, each
 *                     with a bolt that flashes now and then
 *   Predictive Hail   a soft swath along the line of storms, swept in
 *   Flash Edge Model  a warm-to-cool forecast tint, faded over the map
 *   Flash Mobile App  a phone slid in at the corner, showing the same map
 *                     and whatever layers are on
 *
 * While nobody has touched it, the layers switch on one by one, once, as the
 * section comes into view. The motion is CSS (styles/command-center-layers.css,
 * ccl-*). Server HTML, reduced motion and no JavaScript show every layer on
 * and still.
 */

/** The layer each pairing product draws, by product id. */
const LAYERS = {
  'flash-lightning-suite': 'lightning',
  'predictive-hail': 'hail',
  'flash-edge-model': 'edge',
  'flash-mobile-app': 'mobile',
} as const;

type Layer = (typeof LAYERS)[keyof typeof LAYERS];

/** When the first layer comes on after the preview scrolls in, then between layers. */
const AUTO_START_MS = 700;
const AUTO_STEP_MS = 1300;

/** The command center screenshot: the laptop render the page's hero shows. */
const SHOT = '/images/products/flash-weather-command-center-product.png';

/** Strike-risk areas on the screenshot's storm cells, in its 790×510 screen. */
const AREAS = [
  { x: 618, y: 104, rx: 92, ry: 58, rotate: -8 },
  { x: 452, y: 102, rx: 80, ry: 40, rotate: -18 },
  { x: 362, y: 330, rx: 86, ry: 50, rotate: -38 },
];

/** The hail swath's centre line, along the storms from south-west to north-east. */
const SWATH = 'M150 452C268 400 330 340 392 292S520 186 590 142 700 78 770 44';

const noMotion = () => '(prefers-reduced-motion: reduce)';
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(noMotion());
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export function CommandCenterLayers({ products }: { products: (Product & { href: string })[] }) {
  const items = products.map((product) => ({
    product,
    layer: LAYERS[product.id as keyof typeof LAYERS] as Layer | undefined,
  }));
  const layers = items.flatMap((item) => (item.layer ? [item.layer] : []));

  // Until something is chosen: every layer on for the server, reduced motion
  // and no JavaScript; none, ready to play in, otherwise.
  const still = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(noMotion()).matches,
    () => true,
  );
  const [chosen, setChosen] = useState<Layer[] | null>(null);
  const on = chosen ?? (still ? layers : []);
  const [lead, setLead] = useState<Layer | null>(null);

  const root = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  // The layer a hover just added: a click on its switch then keeps it on
  // (the reader came to switch it on) instead of switching it straight off.
  const hoverAdded = useRef<Layer | null>(null);

  const take = () => {
    touched.current = true;
  };
  const set = (layer: Layer, value: boolean) =>
    setChosen((prev) => {
      const now = prev ?? (still ? layers : []);
      if (now.includes(layer) === value) return now;
      return value ? layers.filter((l) => l === layer || now.includes(l)) : now.filter((l) => l !== layer);
    });

  // Idle and in view: switch the layers on one by one, once. Anything the
  // reader does first ends it.
  useEffect(() => {
    const stage = root.current;
    if (!stage || still) return;
    let timer = 0;
    let step = 0;
    const next = (delay: number) => {
      timer = window.setTimeout(() => {
        if (touched.current || step >= layers.length) return;
        set(layers[step++], true);
        next(AUTO_STEP_MS);
      }, delay);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        stage.toggleAttribute('data-inview', entry.isIntersecting);
        clearTimeout(timer);
        if (entry.isIntersecting && !touched.current) next(step ? AUTO_STEP_MS : AUTO_START_MS);
      },
      { threshold: 0.35 },
    );
    observer.observe(stage);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      stage.removeAttribute('data-inview');
    };
    // `layers` and `set` are derived from props on every render; the
    // sequence only restarts when motion is switched on or off.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still]);

  const total = layers.length;
  const count = on.length;
  const meter = count === total ? `${total} products · 1 screen` : `${count} of ${total} layers on`;

  return (
    <div
      ref={root}
      className="ccl"
      data-lightning={on.includes('lightning') ? '' : undefined}
      data-hail={on.includes('hail') ? '' : undefined}
      data-edge={on.includes('edge') ? '' : undefined}
      data-mobile={on.includes('mobile') ? '' : undefined}
      data-lead={lead && on.includes(lead) ? lead : undefined}
    >
      <div className="ccl-stage">
        <WindowFrame title="Weather Command Center" className="ccl-window">
          <div className="ccl-screen">
            <MapView alt="The Weather Command Center map, with the layers of the products switched on drawn over it" />
            <span aria-hidden className="ccl-tag ccl-tag-edge">
              Edge Model forecast
            </span>
            <span aria-hidden className="ccl-tag ccl-tag-lightning">
              Strike risk
            </span>
            <span aria-hidden className="ccl-tag ccl-tag-hail">
              Hail swath
            </span>
            <div aria-hidden className="ccl-phone">
              <MapView />
            </div>
          </div>
        </WindowFrame>
        <p className="ccl-meter">
          <span aria-hidden className="ccl-pips">
            {layers.map((layer) => (
              <span key={layer} className="ccl-pip" data-on={on.includes(layer) ? '' : undefined} />
            ))}
          </span>
          <span>{meter}</span>
        </p>
      </div>

      <ul className="ccl-cards">
        {items.map(({ product, layer }) => {
          const isOn = layer ? on.includes(layer) : false;
          return (
            <Motion as="li" key={product.id} replay={false} threshold={0.2} className="motion ccl-item flex">
              <article
                className="pc ccl-card w-full"
                data-on={isOn ? '' : undefined}
                onPointerEnter={(event) => {
                  if (!layer || event.pointerType !== 'mouse') return;
                  take();
                  setLead(layer);
                  hoverAdded.current = isOn ? null : layer;
                  set(layer, true);
                }}
                onPointerLeave={() => {
                  hoverAdded.current = null;
                  setLead(null);
                }}
                onFocus={() => layer && setLead(layer)}
                onBlur={() => setLead(null)}
                onClick={(event) => {
                  // The link and the switch handle their own clicks.
                  if (!layer || (event.target as Element).closest('a, button')) return;
                  take();
                  // A mouse click only ever adds (hover already has); a tap toggles.
                  const pointer = (event.nativeEvent as PointerEvent).pointerType;
                  const mouse = pointer ? pointer === 'mouse' : window.matchMedia('(hover: hover)').matches;
                  set(layer, mouse ? true : !isOn);
                }}
              >
                <div className="ccl-card-media">
                  <div className="pc-photo absolute inset-0">
                    <Image
                      src={product.image.src}
                      alt={product.image.alt}
                      fill
                      sizes="(min-width: 1280px) 156px, (min-width: 1024px) 120px, (min-width: 480px) 148px, 104px"
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="ccl-card-body">
                  <p className="text-[11px] leading-[14px] font-bold tracking-[0.13em] text-[#8F9AB8] uppercase">
                    {product.category}
                  </p>
                  <h3 className="text-[18px] leading-6 font-extrabold text-text-on-dark">{product.name}</h3>
                  <p className="text-body-s leading-[21px] text-text-on-dark-muted">{product.summary}</p>
                  <div className="ccl-card-foot">
                    <Link
                      href={product.href}
                      className="pc-link inline-flex min-h-11 items-center text-caption font-bold text-viz-gold hover:underline"
                    >
                      {product.name} <span aria-hidden>&nbsp;→</span>
                    </Link>
                    {layer && (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isOn}
                        aria-label={`Add layer: ${product.name}`}
                        className="ccl-switch"
                        onClick={() => {
                          take();
                          if (hoverAdded.current === layer) hoverAdded.current = null;
                          else set(layer, !isOn);
                        }}
                      >
                        <span aria-hidden className="ccl-track">
                          <span className="ccl-knob" />
                        </span>
                        Add layer
                      </button>
                    )}
                  </div>
                </div>
              </article>
            </Motion>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The map with every layer drawn over it; the root's data attributes say
 * which show. Drawn twice: in the window and, with no `alt`, in the phone.
 */
function MapView({ alt }: { alt?: string }) {
  const id = useId();
  const glow = `${id}-glow`;
  const blur = `${id}-blur`;

  return (
    <div className="ccl-map">
      <div className="ccl-shot">
        <Image
          src={SHOT}
          alt={alt ?? ''}
          fill
          sizes="(min-width: 1440px) 1400px, (min-width: 1024px) 110vw, 200vw"
          className="object-cover"
        />
      </div>

      <div aria-hidden className="ccl-fx ccl-edge ccl-loop" />

      <svg aria-hidden className="ccl-fx ccl-hail" viewBox="0 0 790 510" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id={blur} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <g filter={`url(#${blur})`}>
          <path d={SWATH} className="ccl-swath-halo" />
          <path d={SWATH} className="ccl-swath-body" />
        </g>
        <path d={SWATH} className="ccl-swath-core" filter={`url(#${blur})`} />
        <path d={SWATH} className="ccl-swath-sheen ccl-loop" filter={`url(#${blur})`} />
      </svg>

      <svg aria-hidden className="ccl-fx ccl-lightning" viewBox="0 0 790 510" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id={glow}>
            <stop offset="0" className="ccl-glow-core" />
            <stop offset="0.5" className="ccl-glow-mid" />
            <stop offset="1" className="ccl-glow-edge" />
          </radialGradient>
        </defs>
        {AREAS.map((area) => (
          <g key={`${area.x}-${area.y}`} className="ccl-area" transform={`translate(${area.x} ${area.y})`}>
            <g className="ccl-area-body">
              <ellipse rx={area.rx} ry={area.ry} transform={`rotate(${area.rotate})`} fill={`url(#${glow})`} />
              <ellipse
                rx={area.rx * 0.62}
                ry={area.ry * 0.62}
                transform={`rotate(${area.rotate})`}
                className="ccl-area-ring"
              />
              <circle r="34" className="ccl-bloom ccl-loop" />
              <path d={BOLT_PATH} transform="translate(-10 -13) scale(0.78)" className="ccl-bolt ccl-flash ccl-loop" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
