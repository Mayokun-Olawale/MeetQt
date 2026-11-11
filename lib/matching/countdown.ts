export function matchCountdown(revealsAt: string, now: number) {
  const minutes = Math.max(0, Math.ceil((Date.parse(revealsAt) - now) / 60_000));
  return { days: Math.floor(minutes / 1440), hours: Math.floor((minutes % 1440) / 60), minutes: minutes % 60 };
}
