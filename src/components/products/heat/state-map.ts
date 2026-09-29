/*
 * The five states on the Heat page's state-policy map (state-policy.tsx):
 * flat, simplified outlines (a handful of border points each, projected
 * from longitude and latitude with the x axis scaled by cos 32°), drawn in a
 * 290 × 302 box. Neighbours share their border points, so the shapes meet.
 * `label` is the abbreviation and where it sits.
 */

export const MAP_W = 290;
export const MAP_H = 302;

export const stateShapes: Record<string, { d: string; label: [string, number, number] }> = {
  georgia: {
    d: 'M64.8 43.6L93.5 43.6L120.0 43.6L126.6 50.1L135.4 59.2L139.8 72.2L148.6 80.0L157.4 93.0L164.1 108.6L169.6 120.3L161.9 134.6L156.3 154.9L144.2 152.8L139.8 158.8L120.0 157.5L100.1 156.2L80.3 155.4L78.1 147.6L77.0 132.0L78.1 119.0L73.7 98.2L69.3 69.6L64.8 43.6Z',
    label: ['GA', 112, 108],
  },
  florida: {
    d: 'M20.7 147.6L78.1 147.6L80.3 155.4L100.1 156.2L120.0 157.5L139.8 158.8L144.2 152.8L156.3 154.9L159.7 173.6L175.1 212.6L187.2 254.2L186.1 282.8L179.5 298.4L164.1 299.7L148.6 275.0L128.8 238.6L126.6 210.0L106.7 176.2L93.5 172.3L69.3 181.4L49.4 163.2L22.9 165.8Z',
    label: ['FL', 166, 226],
  },
  'north-carolina': {
    d: 'M93.5 43.6L120.0 43.6L137.6 38.4L166.3 39.7L168.5 41.0L170.7 48.8L194.9 48.8L220.3 73.5L234.6 69.6L265.5 51.4L287.5 38.4L287.5 22.8L278.7 3.3L188.3 3.3L150.8 2.0L144.2 15.0L111.1 30.6L93.5 38.4Z',
    label: ['NC', 214, 30],
  },
  'south-carolina': {
    d: 'M120.0 43.6L137.6 38.4L166.3 39.7L168.5 41.0L170.7 48.8L194.9 48.8L220.3 73.5L206.0 90.4L188.3 103.4L169.6 120.3L164.1 108.6L157.4 93.0L148.6 80.0L139.8 72.2L135.4 59.2L126.6 50.1L120.0 43.6Z',
    label: ['SC', 174, 76],
  },
  alabama: {
    d: 'M7.5 43.6L64.8 43.6L69.3 69.6L73.7 98.2L78.1 119.0L77.0 132.0L78.1 147.6L20.7 147.6L22.9 165.8L11.9 167.1L3.1 163.2L2.0 124.2L7.5 46.2Z',
    label: ['AL', 36, 100],
  },
};
