export const VIEW = 280; // crop viewport size in CSS px
export const OUTPUT = 512; // exported image size in px
export const MIN_ZOOM = 1;
export const MAX_ZOOM = 4;

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const DEFAULTS = {
  zoom: 1,
  rotation: 0,
  flip: false,
  brightness: 100,
  contrast: 100,
  offset: { x: 0, y: 0 },
};

/** Scale (screen px per image px) that always keeps the crop square fully covered by the image. */
export function getScale(w, h, rotation, zoom) {
  const rad = (rotation * Math.PI) / 180;
  const spread = Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad));
  return ((VIEW * spread) / Math.min(w, h)) * zoom;
}

/** Keeps the pan offset inside the image so no empty corners ever show up. */
export function constrain(offset, { w, h, rotation, zoom }) {
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const spread = Math.abs(cos) + Math.abs(sin);
  const s = getScale(w, h, rotation, zoom);
  const e = ((VIEW / 2) * spread) / s; // half-extent of the crop square in image space

  // screen offset -> image space
  const px = (cos * offset.x + sin * offset.y) / s;
  const py = (-sin * offset.x + cos * offset.y) / s;
  const cx = clamp(px, -Math.max(0, w / 2 - e), Math.max(0, w / 2 - e));
  const cy = clamp(py, -Math.max(0, h / 2 - e), Math.max(0, h / 2 - e));

  // image space -> screen offset
  return { x: s * (cos * cx - sin * cy), y: s * (sin * cx + cos * cy) };
}
