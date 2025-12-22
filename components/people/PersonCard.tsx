"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type PersonCardProps = {
  name: string;
  avatarUrl?: string;
  active?: boolean;
  isToday?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: (value: boolean) => void;
};

const PersonCard: React.FC<PersonCardProps> = ({
  name,
  avatarUrl,
  active = true,
  isToday = false,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-between px-4 py-2 rounded-lg border hover:bg-muted",
        isToday && "bg-muted"
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{name}</span>
      </div>

      <div className="flex justify-between md:justify-center items-center gap-2">
        <Switch
          checked={active}
          onCheckedChange={(val) => onToggleActive?.(val)}
          className="mr-2"
        />
        <Button size="sm" variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default PersonCard;
