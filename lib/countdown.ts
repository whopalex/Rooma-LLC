const STORAGE_KEY = "np_checkout_deadline";
const WINDOW_MS = 15 * 60 * 1000; // 15 minute urgency window, resets per browser session

export function getCountdownDeadline(): number {
  if (typeof window === "undefined") {
    return Date.now() + WINDOW_MS;
  }

  const stored = window.sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    const deadline = Number(stored);
    if (!Number.isNaN(deadline) && deadline > Date.now()) {
      return deadline;
    }
  }

  const deadline = Date.now() + WINDOW_MS;
  window.sessionStorage.setItem(STORAGE_KEY, String(deadline));
  return deadline;
}

export function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
