"use client";

import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
        "flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-2 rounded-lg border hover:bg-muted",
        isToday && "bg-muted"
      )}
    >
      {/* Avatar + Name */}
      <div className="flex items-center gap-3 mb-2 sm:mb-0 w-full sm:w-auto">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{person.name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{person.name}</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <Switch
          checked={person.active}
          onCheckedChange={(checked) => {
            togglePersonActive(person.id, checked);
            onToggleActive?.(checked);
          }}
          className="sm:mr-2"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={onEdit}
          className="w-full sm:w-auto"
        >
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
