/**
 * The Roofing page's swath report (components/industries/swath-report.tsx):
 * the cells of the Paper "Swath map panel" (784 x 480, 98 px = 1 km), each
 * with the street a canvasser would knock, its largest stone and the minute
 * the hail crossed it. Illustrative, like the figure it replaces.
 *
 * The storm tracks south-west to north-east, entering the map at 16:00; a
 * cell's time and its reveal `step` (0-8) both follow its distance along
 * that track. Peachtree Rd 2.00 in at 16:12 is the map's own label, and
 * Elm St 1.25 in is the job-site cell from the storm-day timeline.
 */

export type SwathTone = 'advisory' | 'watch' | 'warning';

/** Each size class as the legend names it: threshold, name, what sales does. */
export const swathClass: Record<SwathTone, { threshold: string; name: string; action: string }> = {
  warning: { threshold: '≥2.00 in', name: 'destructive', action: 'knock first' },
  watch: { threshold: '≥1.00 in', name: 'damaging', action: 'full inspections' },
  advisory: { threshold: '≥0.75 in', name: 'severe', action: 'inspect on request' },
};

export type SwathCell = {
  col: number;
  row: number;
  tone: SwathTone;
  street: string;
  /** Largest stone in the cell, inches. */
  max: string;
  time: string;
  step: number;
};

export const swathCells: SwathCell[] = [
  { col: 1, row: 1, tone: 'advisory', street: 'Holly Ln', max: '0.75', time: '16:00', step: 0 },
  { col: 2, row: 2, tone: 'advisory', street: 'Cedar Ridge Rd', max: '0.88', time: '16:02', step: 1 },
  { col: 2, row: 1, tone: 'watch', street: 'Dogwood Ln', max: '1.50', time: '16:04', step: 2 },
  { col: 3, row: 3, tone: 'advisory', street: 'Linden Ave', max: '0.88', time: '16:05', step: 2 },
  { col: 2, row: 0, tone: 'advisory', street: 'Chestnut Ln', max: '0.75', time: '16:06', step: 2 },
  { col: 3, row: 2, tone: 'watch', street: 'Elm St', max: '1.25', time: '16:06', step: 3 },
  { col: 3, row: 1, tone: 'warning', street: 'Oak St', max: '2.50', time: '16:08', step: 3 },
  { col: 4, row: 3, tone: 'advisory', street: 'Sycamore Dr', max: '0.88', time: '16:09', step: 3 },
  { col: 3, row: 0, tone: 'watch', street: 'Laurel Way', max: '1.50', time: '16:10', step: 4 },
  { col: 4, row: 2, tone: 'warning', street: 'Elm St', max: '2.25', time: '16:10', step: 4 },
  { col: 4, row: 1, tone: 'warning', street: 'Peachtree Rd', max: '2.00', time: '16:12', step: 5 },
  { col: 5, row: 3, tone: 'advisory', street: 'Pine Hill Dr', max: '0.75', time: '16:13', step: 5 },
  { col: 4, row: 0, tone: 'watch', street: 'Peachtree Rd', max: '1.25', time: '16:14', step: 5 },
  { col: 5, row: 2, tone: 'watch', street: 'Poplar Ave', max: '1.75', time: '16:14', step: 6 },
  { col: 5, row: 1, tone: 'watch', street: 'Hickory Ct', max: '1.75', time: '16:16', step: 6 },
  { col: 5, row: 0, tone: 'advisory', street: 'Birch St', max: '0.88', time: '16:18', step: 7 },
  { col: 6, row: 2, tone: 'advisory', street: 'Willow Bend', max: '0.75', time: '16:18', step: 7 },
  { col: 6, row: 1, tone: 'advisory', street: 'Aspen Ct', max: '0.88', time: '16:20', step: 8 },
];

export type RankedStreet = { street: string; max: string; tone: SwathTone; cells: number };

/**
 * The canvassing list: streets by their largest stone, earliest hail first on
 * a tie, top five. A street that crosses two cells ranks on its worse one.
 */
export const rankedStreets: RankedStreet[] = Object.values(
  swathCells.reduce<Record<string, RankedStreet & { time: string }>>((acc, cell) => {
    const seen = acc[cell.street];
    if (!seen || Number(cell.max) > Number(seen.max)) {
      acc[cell.street] = { street: cell.street, max: cell.max, tone: cell.tone, time: cell.time, cells: (seen?.cells ?? 0) + 1 };
    } else {
      seen.cells += 1;
    }
    return acc;
  }, {}),
)
  .sort((a, b) => Number(b.max) - Number(a.max) || a.time.localeCompare(b.time))
  .slice(0, 5)
  .map(({ street, max, tone, cells }) => ({ street, max, tone, cells }));
