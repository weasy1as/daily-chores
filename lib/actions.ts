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
