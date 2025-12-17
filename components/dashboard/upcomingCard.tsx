import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

type UpcomingDay = {
  label: string;
  date: string;
  person: {
    name: string;
    avatarUrl?: string;
  };
};

const dummyUpcoming: UpcomingDay[] = [
  {
    label: "Today",
    date: "Mar 12",
    person: { name: "Alex", avatarUrl: "https://github.com/shadcn.png" },
  },
  {
    label: "Tomorrow",
    date: "Mar 13",
    person: { name: "Emma" },
  },
  {
    label: "Wednesday",
    date: "Mar 14",
    person: { name: "James" },
  },
  {
    label: "Thursday",
    date: "Mar 15",
    person: { name: "Sarah" },
  },
  {
    label: "Friday",
    date: "Mar 16",
    person: { name: "Lucas" },
  },
];

const UpcomingCard = ({ days = dummyUpcoming }: { days?: UpcomingDay[] }) => {
  return (
    <Card className="p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-sm font-medium">Upcoming Rotation</CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {days.map((day, index) => {
          const isToday = day.label === "Today";

          return (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2",
                isToday && "bg-muted"
              )}
            >
              {/* Left */}
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={day.person.avatarUrl} />
                  <AvatarFallback>{day.person.name[0]}</AvatarFallback>
                </Avatar>

                <div className="leading-tight">
                  <p className="text-sm font-medium">
                    {day.label}
                    <span className="text-muted-foreground font-normal">
                      {" · "}
                      {day.date}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {day.person.name}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default UpcomingCard;
