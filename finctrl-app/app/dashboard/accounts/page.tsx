import { createClient } from "@/lib/supabase/server";
import { AccountsAddForm } from "./AccountsAddForm";
import { AccountsTable } from "./AccountsTable";
import type { AccountRow } from "@/lib/types";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  return (
    <>
      <AccountsAddForm />
      <AccountsTable accounts={(accounts as AccountRow[]) || []} />
    </>
  );
}
