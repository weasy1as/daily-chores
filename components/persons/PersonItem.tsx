import { deletePersonAction, toggleActiveAction } from "@/lib/actions";

export default function PersonItem({ person }) {
  return (
    <div className="flex items-center justify-between border p-3 rounded">
      <div>
        <p className="font-medium">{person.name}</p>
        <p className="text-sm text-gray-500">
          Order: {person.order_index} — {person.active ? "Active" : "Inactive"}
        </p>
      </div>

      <div className="flex gap-2">
        {/* Toggle Active */}
        <form action={toggleActiveAction}>
          <input type="hidden" name="id" value={person.id} />
          <input type="hidden" name="value" value={!person.active} />
          <button className="text-sm px-3 py-1 border rounded">
            {person.active ? "Deactivate" : "Activate"}
          </button>
        </form>

        {/* Delete */}
        <form action={deletePersonAction}>
          <input type="hidden" name="id" value={person.id} />
          <button className="text-sm px-3 py-1 border rounded text-red-500">
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}
