export function safeRedirectPath(value: FormDataEntryValue | string | null, fallback = "/profile") {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}
