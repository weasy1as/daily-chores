"use server";
import { createClient } from "../server";
const supabase = createClient();
export async function addPerson(name: string) {
  const { data, error } = await (
    await supabase
  )
    .from("persons")
    .insert([{ name, order_index: 0, active: true }])
    .select()
    .single();

  if (error) {
    console.error("Error adding person:", error);
    throw new Error(error.message);
  }

  return data;
}

export async function getPeople() {
  const { data, error } = await (await supabase)
    .from("persons")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching people:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function deletePeople(personId: string) {
  const { error } = await (await supabase)
    .from("persons")
    .delete()
    .eq("id", personId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function togglePersonActive(personId: string, active: boolean) {
  const { error } = await (await supabase)
    .from("persons")
    .update({ active })
    .eq("id", personId);

  if (error) {
    console.error("Error toggling active:", error);
    throw new Error(error.message);
  }
}
