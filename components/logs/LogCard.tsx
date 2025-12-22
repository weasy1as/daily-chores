"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type LogCardProps = {
  date: string;
  assigned: string;
  actual: string;
  type: "completed" | "help" | "paid" | "missed";
  notes?: string;
};

const typeColorMap: Record<
  string,
  "default" | "secondary" | "destructive" | "warning"
> = {
  completed: "secondary",
  help: "default",
  paid: "default",
  missed: "destructive",
};

const LogCard: React.FC<LogCardProps> = ({
  date,
  assigned,
  actual,
  type,
  notes,
}) => {
  return (
    <Card className="p-4">
      <CardHeader className="p-0 mb-2">
        <CardTitle className="text-sm font-medium">{date}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex items-center justify-between">
        <div>
          <p className="text-sm">
            {assigned} → {actual}
          </p>
          {notes && <p className="text-xs text-muted-foreground">💬 {notes}</p>}
        </div>
        <Badge variant={typeColorMap[type] || "default"} className="capitalize">
          {type}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default LogCard;
