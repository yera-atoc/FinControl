import { createClient } from "@/lib/supabase/server";
import { OverviewClient } from "@/components/OverviewClient";
import { CurrencyRatesSection } from "@/components/CurrencyRates";
import type { ClientRow, TransactionRow } from "@/lib/types";

export default async function OverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false });

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", user!.id);

  return (
    <>
      <CurrencyRatesSection />
      <OverviewClient
        transactions={(transactions as TransactionRow[]) || []}
        clients={(clients as ClientRow[]) || []}
      />
    </>
  );
}
