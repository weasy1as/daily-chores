// ---------- Common Types ----------
export type UUID = string;
export type Timestamp = string; // ISO string

// ---------- Persons Table ----------
export interface Person {
  id: UUID;
  name: string;
  active: boolean;
  order_index: number;
  created_at: Timestamp;
}

// ---------- Logs Table ----------
export interface Log {
  id: UUID;
  date: string; // YYYY-MM-DD
  assigned_person_id: UUID;
  done_by_person_id?: UUID | null;
  type: "completed" | "help" | "paid" | "missed" | "penalty";
  rotation_shifted: boolean;
  penalty_reason?: string | null;
  notes?: string | null;
  created_at: Timestamp;
}
