import PeopleListCard from "@/components/people/PeopleListCard";
import AddPersonModal from "@/components/people/AddPersonModal";
import { createClient } from "@/lib/server";
import { addPerson, getPeople } from "@/lib/actions/person";

const Page = async () => {
  const peoples = await getPeople();

  return (
    <main className="px-6 py-4 mt-6 space-y-4">
      <AddPersonModal action={addPerson} />
      <PeopleListCard people={peoples || []} />
    </main>
  );
};

export default Page;
