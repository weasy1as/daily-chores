"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LogCardProps = {
  id: string;
  date: string;
  assigned: string;
  actual: string;
  type: "completed" | "help" | "paid" | "missed" | "penalty";
  notes?: string;
};

const typeColorMap: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "secondary",
  help: "default",
  paid: "default",
  missed: "destructive",
  penalty: "destructive",
};

const LogCard: React.FC<LogCardProps> = ({
  id,
  date,
  assigned,
  actual,
  type: initialType,
  notes: initialNotes,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [persons, setPersons] = useState<{ id: string; name: string }[]>([]);
  const [type, setType] = useState<LogCardProps["type"]>(initialType);
  const [notes, setNotes] = useState<string | undefined>(initialNotes);
  const [selectedPersonId, setSelectedPersonId] = useState<
    string | "assigned" | "none" | "other"
  >("none");
  const [otherName, setOtherName] = useState<string>("");

  useEffect(() => {
    // fetch persons for select
    let mounted = true;
    fetch("/api/persons")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        setPersons(((json?.data as any[]) || []).filter((p) => p.active));
      })
      .catch(() => {
        /* ignore */
      });

    return () => {
      mounted = false;
    };
  }, []);

  function resetState() {
    setType(initialType);
    setNotes(initialNotes);
    setSelectedPersonId("none");
    setOtherName("");
  }

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    const payload: any = { id, type, notes };

    if (selectedPersonId === "assigned") {
      // no-op, keep done_by as assigned person
    } else if (selectedPersonId === "none") {
      payload.done_by_person_id = null;
    } else if (selectedPersonId === "other") {
      payload.done_by_person_name = otherName || "";
    } else {
      payload.done_by_person_id = selectedPersonId;
    }

    try {
      const res = await fetch("/api/logs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Updated");
        setOpen(false);
        router.refresh();
      } else {
        toast.error("Update failed: " + (json.error || "unknown"));
      }
    } catch (err) {
      toast.error("Error: " + (err as any).message);
    }
  }

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
        <div className="flex items-center gap-2">
          <Badge
            variant={typeColorMap[type] || "default"}
            className="capitalize"
          >
            {type}
          </Badge>

          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (!o) resetState();
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Log</DialogTitle>
                <DialogDescription>
                  Edit the log details for {date}. Changes will be saved for
                  this date only.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="grid gap-3">
                <Label>Type</Label>
                <select
                  className="h-9 w-full rounded-md border px-3"
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                >
                  <option value="completed">completed</option>
                  <option value="help">help</option>
                  <option value="paid">paid</option>
                  <option value="missed">missed</option>
                  <option value="penalty">penalty</option>
                </select>

                <Label>Done by</Label>
                <select
                  className="h-9 w-full rounded-md border px-3"
                  value={selectedPersonId}
                  onChange={(e) => setSelectedPersonId(e.target.value as any)}
                >
                  <option value="none">None</option>
                  <option value="assigned">Assigned person</option>
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                  <option value="other">Other / external</option>
                </select>

                {selectedPersonId === "other" && (
                  <>
                    <Label>Other name</Label>
                    <Input
                      value={otherName}
                      onChange={(e) => setOtherName(e.target.value)}
                      placeholder="Name of person who did it"
                    />
                  </>
                )}

                <Label>Notes</Label>
                <Input
                  value={notes || ""}
                  onChange={(e) => setNotes(e.target.value)}
                />

                <DialogFooter>
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogCard;
