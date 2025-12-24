import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await (await supabase)
    .from("persons")
    .select("id, name, active")
    .order("order_index", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
