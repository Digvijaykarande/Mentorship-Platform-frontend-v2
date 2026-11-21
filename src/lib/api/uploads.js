import { ApiError, apiClient } from "./client";
import { hostOf } from "../attachments";

/**
 * Uploads one browser File to whichever storage the admin chose (Cloudinary or Google Drive).
 * Resolves to { name, url, publicId, size, mimeType } - the shape the API stores for files.
 * `imageUrl` is an embeddable picture link (use it for avatars); it is the same as `url` on Cloudinary.
 */
export async function uploadFile(file) {
  const sign = await apiClient("/uploads/sign", { method: "POST", body: { size: file.size } });
  if (file.size > sign.maxFileBytes) {
    throw new ApiError(`${file.name} is larger than ${Math.round(sign.maxFileBytes / 1048576)} MB`, 413);
  }

  // Google Drive: the file goes through our API, which saves it in the connected Drive.
  if (sign.mode === "relay") {
    const query = `?name=${encodeURIComponent(file.name)}&type=${encodeURIComponent(file.type || "")}`;
    const saved = await apiClient(`${sign.uploadUrl}${query}`, {
      method: "POST",
      body: file,
      isFormData: true, // send the file as-is instead of JSON
      headers: { "Content-Type": "application/octet-stream" },
    });
    return { name: saved.name, url: saved.url, imageUrl: saved.imageUrl || saved.url, publicId: saved.publicId, size: saved.size, mimeType: saved.mimeType };
  }

  // Cloudinary: the browser posts straight to Cloudinary with the signature we just got.
  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("folder", sign.folder);
  form.append("signature", sign.signature);

  let res;
  try {
    res = await fetch(sign.uploadUrl, { method: "POST", body: form });
  } catch {
    throw new ApiError(`Could not upload ${file.name}. Check your connection.`, 0);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok || !body?.secure_url) {
    throw new ApiError(body?.error?.message || `Could not upload ${file.name}`, res.status);
  }
  return { name: file.name, url: body.secure_url, imageUrl: body.secure_url, publicId: body.public_id, size: file.size, mimeType: file.type || "" };
}

/**
 * Turns what the user picked in <AttachmentPicker> into the objects the API stores:
 * files are uploaded to Cloudinary first, links are passed through untouched.
 * `onProgress(done, total)` is optional. Rejects on the first failed upload.
 */
export async function resolveAttachments(items = [], onProgress) {
  const out = [];
  for (const item of items) {
    if (item.kind === "link") {
      out.push({ name: item.name?.trim() || hostOf(item.url), url: item.url.trim() });
    } else {
      const uploaded = await uploadFile(item.file);
      out.push({ name: uploaded.name, url: uploaded.url, publicId: uploaded.publicId, size: uploaded.size, mimeType: uploaded.mimeType });
    }
    onProgress?.(out.length, items.length);
  }
  return out;
}

export const uploadsApi = {
  /** { me, users, defaults, maxFileBytes, totalBytes } - `users` depends on the role (admin: everyone, mentor: self + interns). */
  usage: () => apiClient("/uploads/usage"),
  /** The files behind a storage number. Pass a user id as an admin / mentor to look at someone else. */
  files: (userId) => apiClient(`/uploads/files${userId ? `?user=${userId}` : ""}`),
  /** Admin only. quotaMb = null goes back to the role default. */
  setQuota: (userId, quotaMb) => apiClient(`/uploads/quota/${userId}`, { method: "PATCH", body: { quotaMb } }),
  /** Intern / mentor asks the admins for more space. */
  requestMore: (body) => apiClient("/uploads/request", { method: "POST", body }),
};
