"use client";

import { Trash2 } from "lucide-react";
import { deleteTransaction } from "@/actions/transactions";
import { formatMoney, formatDateShort } from "@/lib/format";
import type { ClientRow, TransactionRow } from "@/lib/types";
import { Section } from "@/components/ui";

export function OperationsList({ transactions, clients }: { transactions: TransactionRow[]; clients: ClientRow[] }) {
  const clientMap: Record<string, ClientRow> = {};
  clients.forEach((c) => (clientMap[c.id] = c));

  return (
    <Section eyebrow={`${transactions.length} записей`} title="История">
      <div className="flex flex-col">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center gap-3 py-3 border-b border-line">
            <span className="text-[12px] w-14 shrink-0 font-medium text-inkFaint">{formatDateShort(t.date)}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium truncate">
                {t.type === "income" ? (t.client_id && clientMap[t.client_id]?.name) || "Доход без клиента" : t.category}
              </div>
              {t.note && <div className="text-[12px] truncate text-inkSoft">{t.note}</div>}
            </div>
            <span className={`text-[14px] font-semibold shrink-0 font-mono ${t.type === "income" ? "text-accentGreen" : "text-accentRed"}`}>
              {t.type === "income" ? "+" : "−"}
              {formatMoney(t.amount).replace("−", "")}
            </span>
            <form action={deleteTransaction.bind(null, t.id)}>
              <button type="submit" className="shrink-0">
                <Trash2 size={14} className="text-inkFaint" />
              </button>
            </form>
          </div>
        ))}
      </div>
    </Section>
  );
}
