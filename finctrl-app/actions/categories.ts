"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await supabase.from("categories").insert({ user_id: user.id, name });
  revalidatePath("/dashboard/operations");
}

export async function deleteCategory(id: string, _formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/dashboard/operations");
}
