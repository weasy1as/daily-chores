"use client";

import React from "react";
import PersonCard from "./PersonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Person = {
  id: string;
  name: string;
  avatarUrl?: string;
  active: boolean;
  isToday?: boolean;
};

type PeopleListCardProps = {
  people: Person[];
  setPeople?: (people: Person[]) => void;
};

// Wrapper for draggable item
const SortablePersonCard: React.FC<{
  person: Person;
}> = ({ person }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: person.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <PersonCard
        name={person.name}
        avatarUrl={person.avatarUrl}
        active={person.active}
        isToday={person.isToday}
        onEdit={() => console.log("Edit", person.name)}
        onDelete={() => console.log("Delete", person.name)}
        onToggleActive={(val) => console.log("Toggle Active", person.name, val)}
      />
    </div>
  );
};

const PeopleListCard: React.FC<PeopleListCardProps> = ({
  people,
  setPeople,
}) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && setPeople) {
      const oldIndex = people.findIndex((p) => p.id === active.id);
      const newIndex = people.findIndex((p) => p.id === over?.id);
      const newPeople = arrayMove(people, oldIndex, newIndex);
      setPeople(newPeople);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={people.map((p) => p.id)}
        strategy={verticalListSortingStrategy}
      >
        <Card className="p-4">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-sm font-medium">
              Household Members
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-2">
            {people.map((person) => (
              <SortablePersonCard key={person.id} person={person} />
            ))}
          </CardContent>
        </Card>
      </SortableContext>
    </DndContext>
  );
};

export default PeopleListCard;
