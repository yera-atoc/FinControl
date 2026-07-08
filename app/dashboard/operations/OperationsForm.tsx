"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Section, Field, inputClass, PrimaryButton } from "@/components/ui";
import { addTransaction } from "@/actions/transactions";
import { EXPENSE_CATEGORIES, type ClientRow } from "@/lib/types";
import { todayISO } from "@/lib/format";

export function OperationsForm({ clients }: { clients: ClientRow[] }) {
  const [type, setType] = useState<"expense" | "income">("expense");

  return (
    <Section eyebrow="новая запись" title="Добавить операцию">
      <form action={addTransaction}>
        <input type="hidden" name="type" value={type} />
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
              type === "expense" ? "bg-ink text-white" : "bg-bg text-inkSoft"
            }`}
          >
            Расход
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
              type === "income" ? "bg-ink text-white" : "bg-bg text-inkSoft"
            }`}
          >
            Доход
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Field label="Сумма, ₸">
            <input name="amount" type="number" step="0.01" placeholder="0" className={inputClass} required />
          </Field>
          <Field label="Дата">
            <input name="date" type="date" defaultValue={todayISO()} className={inputClass} required />
          </Field>

          {type === "expense" ? (
            <Field label="Категория">
              <select name="category" className={inputClass}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          ) : (
            <Field label="Клиент">
              <select name="clientId" className={inputClass}>
                <option value="">Без клиента</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Заметка (необязательно)">
            <input name="note" placeholder="Комментарий" className={inputClass} />
          </Field>
        </div>

        <PrimaryButton type="submit">
          <Plus size={16} /> Добавить
        </PrimaryButton>
      </form>
    </Section>
  );
}
