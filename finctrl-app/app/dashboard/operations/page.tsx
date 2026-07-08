import { createClient } from "@/lib/supabase/server";
import { OperationsForm } from "./OperationsForm";
import { OperationsList } from "./OperationsList";
import type { ClientRow, TransactionRow } from "@/lib/types";

export default async function OperationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false });

  const { data: clients } = await supabase.from("clients").select("*").eq("user_id", user!.id);

  return (
    <>
      <OperationsForm clients={(clients as ClientRow[]) || []} />
      <OperationsList transactions={(transactions as TransactionRow[]) || []} clients={(clients as ClientRow[]) || []} />
    </>
  );
}
