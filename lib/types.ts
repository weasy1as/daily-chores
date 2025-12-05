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

// ---------- Kitchen Logs Table ----------
export interface KitchenLog {
  id: UUID;
  person_id: UUID; // who was originally assigned
  date: string; // YYYY-MM-DD
  done_by: UUID | null; // null = not completed / missed
  created_at: Timestamp;
}

// ---------- Penalties Table ----------
export interface Penalty {
  id: UUID;
  person_id: UUID;
  days: number; // number of extra turns they receive
  reason: string | null;
  created_at: Timestamp;
}

// ---------- Optional: Swaps Table ----------
export interface RotationSwap {
  id: UUID;
  date: string; // the date the swap is applied to
  from_id: UUID; // original assigned person
  to_id: UUID; // person taking over the day
  created_at: Timestamp;
}

// ---------- Derived / App-Level Types ----------

// For rendering a daily rotation summary
export interface KitchenRotationEntry {
  date: string;
  assigned: Person; // who should do it
  doneBy?: Person | null; // who actually did it
  penaltyApplied?: boolean; // helpful for UI
}

// For reordering persons
export interface PersonOrderUpdate {
  id: UUID;
  order_index: number;
}
