"use server";

import { createClient } from "@/lib/server";

export async function getRecentLogs(limit = 20) {
  const supabase = await createClient();

  const { data, error } = await (await supabase)
    .from("logs")
    .select(
      `*, assigned:persons!assigned_person_id(name), done_by:persons!done_by_person_id(name)`
    )
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return ((data || []) as any).map((row: any) => ({
    id: row.id,
    date: row.date,
    assigned: row.assigned?.name ?? null,
    actual: row.done_by?.name ?? row.assigned?.name ?? null,
    type: row.type,
    notes: row.notes,
  }));
}

export async function getLogForDate(date: string, assignedPersonId?: string) {
  const supabase = await createClient();

  let query = (await supabase)
    .from("logs")
    .select(
      `*, assigned:persons!assigned_person_id(name), done_by:persons!done_by_person_id(name)`
    )
    .eq("date", date)
    .order("created_at", { ascending: false })
    .limit(1);

  if (assignedPersonId)
    query = query.eq("assigned_person_id", assignedPersonId);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  const row = (data || [])[0];
  if (!row) return null;

  return {
    id: row.id,
    date: row.date,
    assigned_person_id: row.assigned_person_id,
    assigned_name: row.assigned?.name ?? null,
    done_by_person_id: row.done_by_person_id,
    done_by_name: row.done_by?.name ?? row.assigned?.name ?? null,
    type: row.type,
    rotation_shifted: row.rotation_shifted,
    penalty_reason: row.penalty_reason,
    notes: row.notes,
    created_at: row.created_at,
  };
}

export async function getLogsForDates(dates: string[]) {
  if (!dates || dates.length === 0) return [];
  const supabase = await createClient();

  const { data, error } = await (await supabase)
    .from("logs")
    .select(
      `*, assigned:persons!assigned_person_id(name), done_by:persons!done_by_person_id(name)`
    )
    .in("date", dates)
    .order("date", { ascending: true });

  if (error) throw new Error(error.message);

  return (data || []).map((row: any) => ({
    id: row.id,
    date: row.date,
    assigned_person_id: row.assigned_person_id,
    assigned_name: row.assigned?.name ?? null,
    done_by_person_id: row.done_by_person_id,
    done_by_name: row.done_by?.name ?? row.assigned?.name ?? null,
    type: row.type,
    rotation_shifted: row.rotation_shifted,
    penalty_reason: row.penalty_reason,
    notes: row.notes,
    created_at: row.created_at,
  }));
}
