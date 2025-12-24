import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Person } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Compute upcoming assignments for the next `days` days starting at `startDate` (inclusive).
 * Strategy:
 * - Use only active people, ordered by `order_index`.
 * - Use the earliest person's `created_at` as a deterministic base date so assignments are stable.
 */
export function getUpcomingAssignments(
  people: Person[] | undefined,
  startDate = new Date(),
  days = 7
) {
  const active = (people || [])
    .filter((p) => p.active)
    .sort((a, b) => a.order_index - b.order_index);

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const dayLabel = (i: number, d: Date) =>
    i === 0
      ? "Today"
      : i === 1
      ? "Tomorrow"
      : d.toLocaleDateString(undefined, { weekday: "long" });

  if (active.length === 0) {
    // Return placeholders if no people are present
    return Array.from({ length: days }).map((_, i) => {
      const date = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + i
      );
      return {
        label: dayLabel(i, date),
        date: formatDate(date),
        person: {
          name: "—" as string,
          avatarUrl: undefined as string | undefined,
        },
      };
    });
  }

  // Use earliest created_at as a stable base date
  const baseMs = Math.min(
    ...active.map((p) => new Date(p.created_at).getTime())
  );
  const toDayStart = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const start = toDayStart(startDate);
  const base = toDayStart(new Date(baseMs));
  const daysSinceBase = Math.floor(
    (start.getTime() - base.getTime()) / (24 * 3600 * 1000)
  );

  return Array.from({ length: days }).map((_, i) => {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i
    );
    const assignedIndex = Math.floor(
      (((daysSinceBase + i) % active.length) + active.length) % active.length
    );
    const person = active[assignedIndex];

    return {
      label: dayLabel(i, date),
      date: formatDate(date),
      person: {
        id: person.id,
        name: person.name,
        avatarUrl: undefined as string | undefined,
      },
    };
  });
}
