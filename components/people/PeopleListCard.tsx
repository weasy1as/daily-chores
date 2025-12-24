"use client";

import PersonCard from "./PersonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Person = {
  id: string;
  name: string;
  active: boolean;
  isToday?: boolean;
};

type Props = {
  people: Person[];
};

export default function PeopleListCard({ people }: Props) {
  return (
    <Card className="p-4">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-sm font-medium">Household Members</CardTitle>
      </CardHeader>

      <CardContent className="p-0 space-y-2">
        {people.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            isToday={person.isToday}
            onEdit={() => console.log("Edit", person.name)}
            onToggleActive={(val) =>
              console.log("Toggle Active", person.name, val)
            }
          />
        ))}
      </CardContent>
    </Card>
  );
}
