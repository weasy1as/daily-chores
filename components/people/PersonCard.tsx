"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import DeletePersonButton from "./DeletePersonButton";
import { deletePeople, togglePersonActive } from "@/lib/actions/person";

type Props = {
  person: {
    id: string;
    name: string;
    active: boolean;
  };
  isToday?: boolean;
  onToggleActive?: (active: boolean) => void;
  onEdit?: () => void;
};

function PersonCard({
  person,
  isToday = false,
  onToggleActive,
  onEdit,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between px-4 py-2 rounded-lg border hover:bg-muted",
        isToday && "bg-muted"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{person.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{person.name}</span>
      </div>

      <div className="flex justify-between md:justify-center items-center gap-2">
        <Switch
          checked={person.active}
          onCheckedChange={(checked) => togglePersonActive(person.id, checked)}
          className="mr-2"
        />
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <DeletePersonButton
          personId={person.id}
          name={person.name}
          onDelete={deletePeople}
        />
      </div>
    </div>
  );
}

export default PersonCard;
