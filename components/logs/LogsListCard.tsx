"use client";

import React from "react";
import LogCard from "./LogCard";

type Log = {
  id: string;
  date: string;
  assigned: string;
  actual: string;
  type: "completed" | "help" | "paid" | "missed";
  notes?: string;
};

type LogsListCardProps = {
  logs: Log[];
};

const LogsListCard: React.FC<LogsListCardProps> = ({ logs }) => {
  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <LogCard
          key={log.id}
          date={log.date}
          assigned={log.assigned}
          actual={log.actual}
          type={log.type}
          notes={log.notes}
        />
      ))}
    </div>
  );
};

export default LogsListCard;
