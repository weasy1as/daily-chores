"use client";

import { reorderPersonsAction } from "@/lib/actions";
import { useEffect, useRef } from "react";
import Sortable from "sortablejs";

export default function SortablePersonList({ persons }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current) return;

    const sortable = Sortable.create(listRef.current, {
      animation: 150,
      handle: ".drag-handle", // only drag from handle
      ghostClass: "opacity-50",
      onEnd: async () => {
        const items = Array.from(listRef.current.children);
        const newOrder = items.map((el: any) => el.dataset.id);

        const formData = new FormData();
        formData.append("order", JSON.stringify(newOrder));

        await reorderPersonsAction(formData);
      },
    });

    return () => sortable.destroy();
  }, []);

  return (
    <div ref={listRef} className="space-y-2">
      {persons.map((p) => (
        <div
          key={p.id}
          data-id={p.id}
          className="border rounded p-3 flex items-center justify-between bg-white"
        >
          <div className="flex items-center gap-3">
            <span className="drag-handle cursor-grab">☰</span>
            <span className="font-medium">{p.name}</span>
          </div>
          <span className="text-sm text-gray-500">
            {p.active ? "Active" : "Inactive"}
          </span>
        </div>
      ))}
    </div>
  );
}
