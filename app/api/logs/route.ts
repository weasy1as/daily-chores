import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await (await supabase)
    .from("logs")
    .select(
      `*, assigned:persons!assigned_person_id(name), done_by:persons!done_by_person_id(name)`
    )
    .order("date", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const formatted = (data || []).map((row: any) => ({
    id: row.id,
    date: row.date,
    assigned_person_id: row.assigned_person_id,
    assigned_name: row.assigned?.name ?? null,
    done_by_person_id: row.done_by_person_id,
    done_by_name: row.done_by?.name ?? null,
    type: row.type,
    rotation_shifted: row.rotation_shifted,
    penalty_reason: row.penalty_reason,
    notes: row.notes,
    created_at: row.created_at,
  }));

  return NextResponse.json({ data: formatted });
}

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createClient();

  const {
    date,
    assigned_person_id,
    done_by_person_id,
    done_by_person_name,
    type = "completed",
    rotation_shifted = false,
    penalty_reason = null,
    notes = null,
  } = body;

  let resolvedDoneById = done_by_person_id ?? null;

  if (!resolvedDoneById && done_by_person_name) {
    const { data: persons } = await (await supabase)
      .from("persons")
      .select("id")
      .eq("name", done_by_person_name)
      .limit(1)
      .single();

    if (persons && persons.id) resolvedDoneById = persons.id;
  }

  const insert = {
    date: date ?? new Date().toISOString().slice(0, 10),
    assigned_person_id,
    done_by_person_id: resolvedDoneById,
    type,
    rotation_shifted,
    penalty_reason,
    notes,
  };

  // Prevent multiple logs per date
  const { data: existing, error: existErr } = await (await supabase)
    .from("logs")
    .select("id")
    .eq("date", insert.date)
    .limit(1)
    .single();

  if (existErr && existErr.code !== "PGRST116") {
    return NextResponse.json({ error: existErr.message }, { status: 500 });
  }

  if (existing && existing.id) {
    return NextResponse.json(
      { error: "Log for this date already exists" },
      { status: 409 }
    );
  }

  const { data, error } = await (await supabase)
    .from("logs")
    .insert([insert])
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const supabase = await createClient();

  const {
    id,
    notes,
    type,
    rotation_shifted,
    penalty_reason,
    done_by_person_id,
    done_by_person_name,
  } = body;

  let resolvedDoneById = done_by_person_id ?? null;

  if (!resolvedDoneById && done_by_person_name) {
    const { data: persons } = await (await supabase)
      .from("persons")
      .select("id")
      .eq("name", done_by_person_name)
      .limit(1)
      .single();

    if (persons && persons.id) resolvedDoneById = persons.id;
  }

  const updatePayload: any = {};
  if (notes !== undefined) updatePayload.notes = notes;
  if (type !== undefined) updatePayload.type = type;
  if (rotation_shifted !== undefined)
    updatePayload.rotation_shifted = rotation_shifted;
  if (penalty_reason !== undefined)
    updatePayload.penalty_reason = penalty_reason;
  if (resolvedDoneById !== undefined)
    updatePayload.done_by_person_id = resolvedDoneById;

  const { data, error } = await (await supabase)
    .from("logs")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ data });
}
