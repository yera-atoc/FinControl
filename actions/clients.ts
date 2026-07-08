"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addClient(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const name = String(formData.get("name") || "").trim();
  const contact = String(formData.get("contact") || "");
  if (!name) return;

  await supabase.from("clients").insert({
    user_id: user.id,
    name,
    contact,
    status: "new",
    result: "",
    paid: 0,
  });

  revalidatePath("/dashboard/clients");
}

export async function completeClient(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const result = String(formData.get("result") || "");
  const paid = parseFloat(String(formData.get("paid") || "0")) || 0;

  await supabase.from("clients").update({ status: "completed", result, paid }).eq("id", id);
  revalidatePath("/dashboard/clients");
}

export async function reopenClient(id: string, _formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("clients").update({ status: "new" }).eq("id", id);
  revalidatePath("/dashboard/clients");
}

export async function deleteClient(id: string, _formData?: FormData) {
  const supabase = await createClient();
  await supabase.from("clients").delete().eq("id", id);
  revalidatePath("/dashboard/clients");
}
