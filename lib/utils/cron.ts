// Parses and formats the simple cron patterns used by Venturo workflows.
// Only handles "minute hour * * days" patterns — no complex cron expressions.

export type ScheduleFields = {
  time: string;  // "HH:MM", 24-hour
  days: number[]; // 0=Sun, 1=Mon … 6=Sat; empty array = every day
};

const DAY_LABELS: Record<number, string> = {
  0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat",
};

/** "0 9 * * 2,5" → { time: "09:00", days: [2, 5] } */
export function parseCron(cron: string): ScheduleFields {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return { time: "09:00", days: [] };

  const [minute, hour, , , dayPart] = parts;
  const h = String(Number(hour)).padStart(2, "0");
  const m = String(Number(minute)).padStart(2, "0");
  const days =
    dayPart === "*"
      ? []
      : dayPart.split(",").map(Number).filter((d) => d >= 0 && d <= 6);

  return { time: `${h}:${m}`, days };
}

/** { time: "09:00", days: [2, 5] } → "0 9 * * 2,5" */
export function buildCron({ time, days }: ScheduleFields): string {
  const [hourStr, minuteStr] = time.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  const dayPart = days.length === 0 ? "*" : [...days].sort((a, b) => a - b).join(",");
  return `${minute} ${hour} * * ${dayPart}`;
}

/** Human-readable: "09:00 on Mon, Wed, Fri" or "09:00 daily" */
export function formatSchedule({ time, days }: ScheduleFields): string {
  if (days.length === 0) return `${time} daily`;
  if (days.length === 7) return `${time} daily`;
  return `${time} on ${days.map((d) => DAY_LABELS[d] ?? d).join(", ")}`;
}

export const ALL_DAYS = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
];
