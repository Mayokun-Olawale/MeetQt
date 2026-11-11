export const EVENT_NOTICE_MS = 24 * 60 * 60 * 1000;
export const EVENT_NOTICE_MESSAGE = "Events must start at least 24 hours from now.";

export function hasMinimumEventNotice(startsAt: string, now = Date.now()): boolean {
  return Date.parse(startsAt) >= now + EVENT_NOTICE_MS;
}
