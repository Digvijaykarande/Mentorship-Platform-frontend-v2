/** Small helpers shared by everything that shows or collects attachments (files and links). */

export function formatBytes(bytes = 0) {
  if (!bytes || bytes < 1) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${Number(value.toFixed(value < 10 ? 2 : 1))} ${units[i]}`;
}

export const isImage = (a) => /^image\//.test(a?.mimeType || "") || /\.(png|jpe?g|gif|webp|svg)$/i.test(a?.name || "");
export const isPdf = (a) => a?.mimeType === "application/pdf" || /\.pdf$/i.test(a?.name || "");

export const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const isHttpUrl = (value) => /^https?:\/\/\S+$/i.test((value || "").trim());

/** A link that works inside <img>. Google Drive "view" links are pages, so they map to Drive's picture link. */
export const previewUrl = (a) => {
  const id = /^https:\/\/drive\.google\.com\/file\/d\/([^/?#]+)/.exec(a?.url || "")?.[1];
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w160` : a?.url;
};
