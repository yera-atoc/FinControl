"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTask(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const title = String(formData.get("title") || "").trim();
  const due = String(formData.get("due") || "");
  if (!title || !due) return;

  await supabase.from("tasks").insert({ user_id: user.id, title, due, done: false });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}

export async function toggleTask(id: string, done: boolean, _formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("tasks").update({ done: !done }).eq("id", id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}

export async function deleteTask(id: string, _formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/tasks");
}
