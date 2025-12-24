import OrderListCard from "@/components/dashboard/OrderListCard";
import TodayCard from "@/components/dashboard/todayCard";
import UpcomingCard from "@/components/dashboard/upcomingCard";
import { getPersons } from "@/lib/actions";
import { getUpcomingAssignments } from "@/lib/utils";
import React from "react";

const Page = async () => {
  const peoples = await getPersons();
  // Compute initial upcoming assignments
  const upcoming = getUpcomingAssignments(peoples, new Date(), 7);

  // Build date range: yesterday through the end of upcoming to detect missed penalties
  const start = new Date();
  const datesToQuery: string[] = [];
  for (let i = -1; i < 7; i++) {
    const d = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i
    );
    datesToQuery.push(d.toISOString().slice(0, 10));
  }

  const rangeLogs = await (
    await import("@/lib/actions/logs")
  ).getLogsForDates(datesToQuery);
  const logsByDate: Record<string, any> = {};
  rangeLogs.forEach((r) => (logsByDate[r.date] = r));

  // Apply repeat-next-day rule for missed logs: if a day is missed, the assigned person must do the next day
  const adjustedUpcoming = upcoming.map((slot, idx) => {
    const date = new Date();
    date.setDate(date.getDate() + idx);
    const iso = date.toISOString().slice(0, 10);

    // if previous day (isoPrev) had a missed log, repeat that person
    if (idx > 0) {
      const prev = new Date();
      prev.setDate(prev.getDate() + idx - 1);
      const prevIso = prev.toISOString().slice(0, 10);
      const prevLog = logsByDate[prevIso];
      if (
        prevLog &&
        (prevLog.type === "missed" || prevLog.type === "penalty")
      ) {
        return {
          ...slot,
          person: {
            id: prevLog.assigned_person_id,
            name: prevLog.assigned_name,
            avatarUrl: undefined,
          },
        };
      }
    }

    // otherwise keep default
    return slot;
  });

  const today = adjustedUpcoming[0];

  // Fetch any existing log for today for the assigned person
  const todayIso = new Date().toISOString().slice(0, 10);
  const todayLog = logsByDate[todayIso] ?? null;

  const mapLogTypeToStatus = (type: string) => {
    switch (type) {
      case "completed":
        return "completed" as const;
      case "help":
        return "done_by_other" as const;
      case "paid":
        return "paid" as const;
      case "missed":
      case "penalty":
        return "missed" as const;
      default:
        return "not_done" as const;
    }
  };

  const todayData = {
    date: new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    assignedPerson: {
      id: (today.person as any).id,
      name: today.person.name,
      avatarUrl: today.person.avatarUrl,
    },
    status: todayLog
      ? mapLogTypeToStatus(todayLog.type)
      : ("not_done" as const),
    actualPerson: todayLog ? todayLog.done_by_name : undefined,
    notes: todayLog ? todayLog.notes ?? todayLog.penalty_reason : undefined,
  };

  return (
    <main className="px-6 py-4 mt-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {/* Left / Main Column */}
        <section className="flex flex-col gap-4 lg:col-span-2">
          <TodayCard data={todayData} people={peoples} />
          <UpcomingCard people={peoples} />
        </section>

        {/* Right / Secondary Column */}
        <section className="lg:col-span-1">
          <OrderListCard people={peoples} />
        </section>
      </div>
    </main>
  );
};

export default Page;
