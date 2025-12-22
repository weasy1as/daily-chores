"use server";
import { createClient } from "../server";

export async function addPerson(name: string) {
  "use server"; // marks this as a server action

  const supabase = createClient();

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
  "use server"; // marks this as a server action

  const supabase = createClient();

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
