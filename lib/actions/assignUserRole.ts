"use server";

import { createClient } from "../server";

const supabase = createClient();
export async function assignUserRole(userId: string, role: "admin" | "member") {
  const { error } = await (
    await supabase
  ).auth.admin.updateUserById(userId, {
    app_metadata: {
      role,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
