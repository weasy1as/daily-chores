import PersonItem from "./PersonItem";
import SortablePersonList from "./SortablePersonList";

export default function PersonList({ persons }) {
  return (
    <div className="space-y-3">
      <SortablePersonList persons={persons} />
    </div>
  );
}
