"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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

import type { Person } from "@/lib/types";

type TodayAssignment = {
  date: string;
  assignedPerson: {
    id?: string;
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

const TodayCard = ({
  data = dummyData,
  people,
}: {
  data?: TodayAssignment;
  people?: Person[];
}) => {
  const [isLogged, setIsLogged] = useState(data.status !== "not_done");
  const [actualPerson, setActualPerson] = useState<string | undefined>(
    data.actualPerson
  );
  const [notes, setNotes] = useState<string | undefined>(data.notes);

  const [openHelp, setOpenHelp] = useState(false);
  const [openPaid, setOpenPaid] = useState(false);
  const [openMissed, setOpenMissed] = useState(false);

  const [selectedPersonId, setSelectedPersonId] = useState<string | undefined>(
    undefined
  );
  const [formNotes, setFormNotes] = useState<string | undefined>(undefined);
  const [penaltyReason, setPenaltyReason] = useState<string | undefined>(
    undefined
  );
  const [rotationShifted, setRotationShifted] = useState(false);

  const router = useRouter();

  async function callCreateLog(payload: any) {
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok) {
        setIsLogged(true);
        setActualPerson(
          payload.done_by_person_id
            ? (people || []).find((p) => p.id === payload.done_by_person_id)
                ?.name || data.assignedPerson.name
            : payload.done_by_person_name || data.assignedPerson.name
        );
        setNotes(payload.notes || payload.penalty_reason || formNotes);
        setOpenHelp(false);
        setOpenPaid(false);
        setOpenMissed(false);
        setFormNotes(undefined);
        setPenaltyReason(undefined);
        setRotationShifted(false);
        router.refresh();
        toast.success("Logged successfully");
      } else {
        toast.error(json.error || "Error logging");
      }
    } catch (e) {
      toast.error("Error logging: " + (e as any).message);
    }
  }

  return (
    <Card className="p-4 sm:p-6">
      {/* Header */}
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-sm text-muted-foreground">
          Today · {data.date}
        </CardTitle>
      </CardHeader>

      {/* Assigned Person */}
      <CardContent className="p-0 flex flex-col sm:flex-row items-center gap-4 mb-6">
        <Avatar className="h-12 w-12">
          <AvatarImage src={data.assignedPerson.avatarUrl} />
          <AvatarFallback>{data.assignedPerson.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold">{data.assignedPerson.name}</h2>
          <p className="text-sm text-muted-foreground">Assigned for today</p>
        </div>
      </CardContent>

      {/* Status / Actions */}
      <CardFooter className="p-0">
        {!isLogged ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {/* Completed */}
            <Button
              className="w-full gap-2"
              onClick={() =>
                callCreateLog({
                  assigned_person_id: data.assignedPerson.id,
                  done_by_person_name: data.assignedPerson.name,
                  type: "completed",
                })
              }
            >
              <CheckCircle className="h-4 w-4" /> Completed by me
            </Button>

            {/* Help */}
            <Dialog open={openHelp} onOpenChange={setOpenHelp}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full gap-2">
                  <Users className="h-4 w-4" /> Done by someone else
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-full">
                <DialogHeader>
                  <DialogTitle>Done by someone else</DialogTitle>
                  <DialogDescription>
                    Choose who helped or replaced the assigned person and add
                    optional notes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label>Who did it</Label>
                  <select
                    className="h-9 w-full rounded-md border px-3"
                    value={selectedPersonId}
                    onChange={(e) => setSelectedPersonId(e.target.value)}
                  >
                    <option value={undefined as any}>Select a person</option>
                    {(people || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                    <option value={"other"}>Other / external</option>
                  </select>

                  <Label>Notes</Label>
                  <Input
                    value={formNotes || ""}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="ghost" onClick={() => setOpenHelp(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const payload: any = {
                        assigned_person_id: data.assignedPerson.id,
                        type: "help",
                        notes: formNotes || null,
                      };
                      if (selectedPersonId && selectedPersonId !== "other") {
                        payload.done_by_person_id = selectedPersonId;
                      } else if (selectedPersonId === "other") {
                        payload.done_by_person_name = formNotes || "(external)";
                      }
                      callCreateLog(payload);
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Paid */}
            <Dialog open={openPaid} onOpenChange={setOpenPaid}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full gap-2">
                  <DollarSign className="h-4 w-4" /> Paid replacement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-full">
                <DialogHeader>
                  <DialogTitle>Paid replacement</DialogTitle>
                  <DialogDescription>
                    Record a paid replacement. Choose who did it and add
                    optional notes.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label>Who did it</Label>
                  <select
                    className="h-9 w-full rounded-md border px-3"
                    value={selectedPersonId}
                    onChange={(e) => setSelectedPersonId(e.target.value)}
                  >
                    <option value={undefined as any}>Select a person</option>
                    {(people || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <Label>Notes</Label>
                  <Input
                    value={formNotes || ""}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="ghost" onClick={() => setOpenPaid(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const payload: any = {
                        assigned_person_id: data.assignedPerson.id,
                        type: "paid",
                        notes: formNotes || null,
                      };
                      if (selectedPersonId)
                        payload.done_by_person_id = selectedPersonId;
                      callCreateLog(payload);
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Missed / Penalty */}
            <Dialog open={openMissed} onOpenChange={setOpenMissed}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full gap-2">
                  <AlertTriangle className="h-4 w-4" /> Missed / Penalty
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-full">
                <DialogHeader>
                  <DialogTitle>Missed / Penalty</DialogTitle>
                  <DialogDescription>
                    Record a missed day and optional penalty details.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label>Penalty reason</Label>
                  <Input
                    value={penaltyReason || ""}
                    onChange={(e) => setPenaltyReason(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      id="shift"
                      type="checkbox"
                      checked={rotationShifted}
                      onChange={(e) => setRotationShifted(e.target.checked)}
                    />
                    <label htmlFor="shift" className="text-sm">
                      Shift rotation
                    </label>
                  </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="ghost" onClick={() => setOpenMissed(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const payload: any = {
                        assigned_person_id: data.assignedPerson.id,
                        type: "missed",
                        rotation_shifted: rotationShifted,
                        penalty_reason: penaltyReason || null,
                      };
                      callCreateLog(payload);
                    }}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="w-full text-sm text-muted-foreground">
            <p>
              Completed by{" "}
              <span className="font-medium text-foreground">
                {actualPerson ?? data.assignedPerson.name}
              </span>
            </p>
            {notes && <p className="mt-1 italic text-xs">{notes}</p>}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TodayCard;
