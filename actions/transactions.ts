"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const type = String(formData.get("type"));
  const amount = parseFloat(String(formData.get("amount")));
  const date = String(formData.get("date"));
  const category = type === "expense" ? String(formData.get("category") || "") : null;
  const clientId = type === "income" ? (String(formData.get("clientId") || "") || null) : null;
  const note = String(formData.get("note") || "");

  if (!amount || amount <= 0 || !date) return;

  await supabase.from("transactions").insert({
    user_id: user.id,
    type,
    amount,
    category,
    client_id: clientId,
    date,
    note,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/operations");
}

export async function deleteTransaction(id: string, _formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("transactions").delete().eq("id", id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/operations");
}
