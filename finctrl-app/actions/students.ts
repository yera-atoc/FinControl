"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addStudent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await supabase.from("students").insert({
    user_id: user.id,
    name,
    phone: String(formData.get("phone") || ""),
    test_date: formData.get("test_date") ? String(formData.get("test_date")) : null,
    result: String(formData.get("result") || ""),
    paid: parseFloat(String(formData.get("paid") || "0")) || 0,
  });

  revalidatePath("/dashboard/students");
}

export async function updateStudent(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const name = String(formData.get("name") || "").trim();
  const phone = String(formData.get("phone") || "");
  const test_date = formData.get("test_date") ? String(formData.get("test_date")) : null;
  const result = String(formData.get("result") || "");
  const paid = parseFloat(String(formData.get("paid") || "0")) || 0;

  await supabase
    .from("students")
    .update({ name, phone, test_date, result, paid })
    .eq("id", id);

  revalidatePath("/dashboard/students");
}

export async function deleteStudent(id: string, _formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("students").delete().eq("id", id);
  revalidatePath("/dashboard/students");
}
