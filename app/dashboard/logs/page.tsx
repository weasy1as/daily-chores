import React from "react";
import LogsListCard from "@/components/logs/LogsListCard";

import { getRecentLogs } from "@/lib/actions/logs";

const Page = async () => {
  const logs = await getRecentLogs(20);

  return (
    <main className="px-6 py-4 mt-6">
      <h1 className="text-xl font-semibold mb-4">Kitchen Logs</h1>
      <LogsListCard logs={logs} />
    </main>
  );
};

export default Page;
