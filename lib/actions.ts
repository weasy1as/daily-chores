"use server";

import { createClient } from "./server";

export async function getPersons() {
  const supabase = createClient();

  const { data, error } = await (await supabase)
    .from("persons")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) throw error;
  return data;
}

export async function addPerson(formData: FormData) {
  const supabase = createClient();

  const name = formData.get("name") as string;

  // find max order_index
  const { data: maxRow } = await (await supabase)
    .from("persons")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = maxRow?.order_index + 1 || 1;

  const { error } = await (await supabase).from("persons").insert({
    name,
    order_index: nextOrder,
  });

  if (error) throw error;
}

export async function toggleActive(id: string, active: boolean) {
  const supabase = createClient();

  const { error } = await (await supabase)
    .from("persons")
    .update({ active })
    .eq("id", id);

  if (error) throw error;
}

export async function updateOrder(
  order: { id: string; order_index: number }[]
) {
  const supabase = createClient();

  const { error } = await (await supabase).from("persons").upsert(order);

  if (error) throw error;
}

export async function deletePerson(id: string) {
  const supabase = createClient();

  const { error } = await (await supabase)
    .from("persons")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function toggleActiveAction(formData: FormData) {
  const id = formData.get("id") as string;
  const value = formData.get("value") === "true";

  const supabase = createClient();
  await (await supabase).from("persons").update({ active: value }).eq("id", id);
}

export async function deletePersonAction(formData: FormData) {
  const id = formData.get("id") as string;

  const supabase = createClient();
  await (await supabase).from("persons").delete().eq("id", id);
}

export async function reorderPersonsAction(formData: FormData) {
  const orderString = formData.get("order") as string;
  const ids = JSON.parse(orderString) as string[];

  const supabase = createClient();

  const updates = ids.map((id, index) => ({
    id,
    order_index: index,
  }));

  // Efficient bulk update
  for (const row of updates) {
    await (await supabase)
      .from("persons")
      .update({ order_index: row.order_index })
      .eq("id", row.id);
  }
}
