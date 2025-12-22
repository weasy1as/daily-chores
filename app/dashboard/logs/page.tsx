import React from "react";
import LogsListCard from "@/components/logs/LogsListCard";

const dummyLogs = [
  {
    id: "1",
    date: "Dec 20",
    assigned: "Alex",
    actual: "Alex",
    type: "completed",
  },
  {
    id: "2",
    date: "Dec 19",
    assigned: "Emma",
    actual: "Alex",
    type: "help",
    notes: "Helped Emma",
  },
  {
    id: "3",
    date: "Dec 18",
    assigned: "James",
    actual: "James",
    type: "paid",
    notes: "Paid replacement",
  },
  {
    id: "4",
    date: "Dec 17",
    assigned: "Sarah",
    actual: "Sarah",
    type: "missed",
    notes: "Missed day",
  },
  {
    id: "5",
    date: "Dec 16",
    assigned: "Lucas",
    actual: "Lucas",
    type: "completed",
  },
];

const Page = () => {
  return (
    <main className="px-6 py-4 mt-6">
      <h1 className="text-xl font-semibold mb-4">Kitchen Logs</h1>
      <LogsListCard logs={dummyLogs} />
    </main>
  );
};

export default Page;
