"use client";
import { useState } from "react";
import PeopleListCard from "@/components/people/PeopleListCard";
import AddPersonModal from "@/components/people/AddPersonModal";

const dummyPeople = [
  { id: "1", name: "Alex", active: true, isToday: true },
  { id: "2", name: "Emma", active: true },
  { id: "3", name: "James", active: false },
  { id: "4", name: "Sarah", active: true },
];

const Page = () => {
  const [people, setPeople] = useState(dummyPeople);

  const handleAdd = (name: string) => {
    const newPerson = {
      id: Date.now().toString(),
      name,
      active: true,
    };
    setPeople([...people, newPerson]);
  };

  return (
    <main className="px-6 py-4 mt-6 space-y-4">
      <AddPersonModal onAdd={handleAdd} />
      <PeopleListCard people={people} setPeople={setPeople} />
    </main>
  );
};

export default Page;
