/**
 * The Flash bolt glyph, in a 26×34 box: the one path every small bolt on the
 * site draws. Both ends come to a point, top right and bottom left, and both
 * sit inside the box, so nothing crops it at any size.
 *
 * Two places cannot import it and carry the same points by hand: the
 * `bolt-shape` clip-path (app/globals.css) and the `.home-gold-bolt` mask
 * (styles/home.css). Change all three together.
 */
export const BOLT_PATH = 'M19.6 0L0 19.6h8.9L6.4 34 26 12.6H15.8z';
