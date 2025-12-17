import OrderListCard from "@/components/dashboard/OrderListCard";
import TodayCard from "@/components/dashboard/todayCard";
import UpcomingCard from "@/components/dashboard/upcomingCard";
import React from "react";

const Page = () => {
  return (
    <main className="px-6 py-4 mt-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left / Main Column */}
        <section className="flex flex-col gap-4 lg:col-span-2">
          <TodayCard />
          <UpcomingCard />
        </section>

        {/* Right / Secondary Column */}
        <section className="lg:col-span-1">
          <OrderListCard />
        </section>
      </div>
    </main>
  );
};

export default Page;
