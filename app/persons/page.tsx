import PersonList from "@/components/persons/PersonList";
import {
  getPersons,
  addPerson,
  toggleActive,
  deletePerson,
} from "@/lib/actions";
export default async function PersonsPage() {
  const persons = await getPersons();

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Manage Persons</h1>

      <form action={addPerson} className="flex gap-2 mb-6">
        <input
          name="name"
          placeholder="New person's name"
          className="border p-2 rounded w-full"
          required
        />
        <button className="bg-black text-white px-4 rounded">Add</button>
      </form>

      <PersonList persons={persons} />
    </div>
  );
}
