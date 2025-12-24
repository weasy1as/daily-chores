import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { Person } from "@/lib/types";

type Props = {
  people: Person[];
};

const OrderListCard = ({ people }: Props) => {
  return (
    <Card className="p-6 h-full">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-sm font-medium">Rotation Order</CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        {people.map((person) => (
          <div
            key={person.id}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2"
            )}
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{person.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{person.name}</span>
              </div>
            </div>

            {/* Order index */}
            <span className="text-xs text-muted-foreground">
              #{person.order_index + 1}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default OrderListCard;
