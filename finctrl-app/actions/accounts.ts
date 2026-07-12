"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addAccount(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  await supabase.from("accounts").insert({
    user_id: user.id,
    name,
    bank: String(formData.get("bank") || ""),
    balance: parseFloat(String(formData.get("balance") || "0")) || 0,
  });

  revalidatePath("/dashboard/accounts");
}

export async function updateAccount(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!id) return;

  const name = String(formData.get("name") || "").trim();
  const bank = String(formData.get("bank") || "");
  const balance = parseFloat(String(formData.get("balance") || "0")) || 0;

  await supabase.from("accounts").update({ name, bank, balance }).eq("id", id);
  revalidatePath("/dashboard/accounts");
}

export async function deleteAccount(id: string, _formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("accounts").delete().eq("id", id);
  revalidatePath("/dashboard/accounts");
}
