import { createClient } from "@/lib/supabase/server";
import { AccountsSection } from "./AccountsSection";
import type { AccountRow } from "@/lib/types";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  return <AccountsSection initialAccounts={(accounts as AccountRow[]) || []} />;
}
