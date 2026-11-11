export type SwipeDecision = "skip" | "interested";

export function swipeDecision(dx: number, dy: number): SwipeDecision | null {
  if (Math.abs(dx) < 80 || Math.abs(dx) < Math.abs(dy) * 1.5) return null;
  return dx > 0 ? "interested" : "skip";
}
