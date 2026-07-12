import { createClient } from "@/lib/supabase/server";
import { OperationsSection } from "./OperationsSection";
import type { CategoryRow, ClientRow, TransactionRow } from "@/lib/types";

export default async function OperationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false });

  const { data: clients } = await supabase.from("clients").select("*").eq("user_id", user!.id);

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  return (
    <OperationsSection
      clients={(clients as ClientRow[]) || []}
      initialTransactions={(transactions as TransactionRow[]) || []}
      initialCategories={(categories as CategoryRow[]) || []}
    />
  );
}
