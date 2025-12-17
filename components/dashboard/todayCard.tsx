import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CheckCircle, AlertTriangle, Users, DollarSign } from "lucide-react";

type TodayAssignment = {
  date: string;
  assignedPerson: {
    name: string;
    avatarUrl?: string;
  };
  status: "not_done" | "completed" | "done_by_other" | "paid" | "missed";
  actualPerson?: string;
  notes?: string;
};

const dummyData: TodayAssignment = {
  date: "Tuesday, March 12",
  assignedPerson: {
    name: "Alex",
    avatarUrl: "https://github.com/shadcn.png",
  },
  status: "not_done",
};

const TodayCard = ({ data = dummyData }: { data?: TodayAssignment }) => {
  const isLogged = data.status !== "not_done";

  return (
    <Card className="p-6">
      {/* Header */}
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-sm text-muted-foreground">
          Today · {data.date}
        </CardTitle>
      </CardHeader>

      {/* Assigned Person */}
      <CardContent className="p-0 flex items-center gap-4 mb-6">
        <Avatar className="h-12 w-12">
          <AvatarImage src={data.assignedPerson.avatarUrl} />
          <AvatarFallback>{data.assignedPerson.name[0]}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-lg font-semibold">{data.assignedPerson.name}</h2>
          <p className="text-sm text-muted-foreground">Assigned for today</p>
        </div>
      </CardContent>

      {/* Status / Actions */}
      <CardFooter className="p-0">
        {!isLogged ? (
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button className="w-full gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed by me
            </Button>

            <Button variant="secondary" className="w-full gap-2">
              <Users className="h-4 w-4" />
              Done by someone else
            </Button>

            <Button variant="secondary" className="w-full gap-2">
              <DollarSign className="h-4 w-4" />
              Paid replacement
            </Button>

            <Button variant="destructive" className="w-full gap-2">
              <AlertTriangle className="h-4 w-4" />
              Missed / Penalty
            </Button>
          </div>
        ) : (
          <div className="w-full text-sm text-muted-foreground">
            <p>
              Completed by{" "}
              <span className="font-medium text-foreground">
                {data.actualPerson ?? data.assignedPerson.name}
              </span>
            </p>
            {data.notes && <p className="mt-1 italic text-xs">{data.notes}</p>}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TodayCard;
