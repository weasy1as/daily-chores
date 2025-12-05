import { addPerson } from "@/lib/actions";
import React from "react";

const AddPersonForm = () => {
  return (
    <div>
      {" "}
      {/* Add Person Form */}
      <form action={addPerson} className="flex gap-2 mb-6">
        <input
          name="name"
          placeholder="New person's name"
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-black text-white px-4 rounded">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddPersonForm;
