export const MAX_FLYER_BYTES = 4 * 1024 * 1024;
export const FLYER_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function flyerExtension(bytes: Uint8Array, type: string): string | null {
  if (type === "image/jpeg" && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (type === "image/png" && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, i) => bytes[i] === byte)) return "png";
  if (type === "image/webp" && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP") return "webp";
  return null;
}
