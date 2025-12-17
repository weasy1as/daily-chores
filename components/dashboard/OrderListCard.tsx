import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

type RotationPerson = {
  name: string;
  avatarUrl?: string;
  isToday?: boolean;
};

const dummyRotation: RotationPerson[] = [
  { name: "Emma" },
  { name: "James" },
  { name: "Sarah" },
  { name: "Alex", isToday: true },
  { name: "Lucas" },
  { name: "Megan" },
  { name: "Olivia" },
];

const OrderListCard = ({
  people = dummyRotation,
}: {
  people?: RotationPerson[];
}) => {
  return (
    <Card className="p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-sm font-medium">Rotation Order</CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        {people.map((person, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2",
              person.isToday && "bg-muted"
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={person.avatarUrl} />
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{person.name}</span>

                {person.isToday && (
                  <Badge variant="secondary" className="text-xs">
                    Today
                  </Badge>
                )}
              </div>
            </div>

            {/* Order index */}
            <span className="text-xs text-muted-foreground">#{index + 1}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderListCard;
