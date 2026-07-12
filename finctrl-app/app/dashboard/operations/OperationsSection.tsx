"use client";

import { useState, useTransition } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { Section, Field, inputClass } from "@/components/ui";
import { addTransaction, deleteTransaction } from "@/actions/transactions";
import { addCategory, deleteCategory } from "@/actions/categories";
import { EXPENSE_CATEGORIES, type ClientRow, type CategoryRow, type TransactionRow } from "@/lib/types";
import { formatMoney, formatDateShort, todayISO } from "@/lib/format";

export function OperationsSection({
  clients,
  initialTransactions,
  initialCategories,
}: {
  clients: ClientRow[];
  initialTransactions: TransactionRow[];
  initialCategories: CategoryRow[];
}) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [addingCategory, setAddingCategory] = useState(false);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [categories, setCategories] = useState(initialCategories);
  const [, startTransition] = useTransition();

  const clientMap: Record<string, ClientRow> = {};
  clients.forEach((c) => (clientMap[c.id] = c));

  const allCategories = [...EXPENSE_CATEGORIES, ...categories.map((c) => c.name)];

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("type", type);
    const amount = parseFloat(String(fd.get("amount")));
    const date = String(fd.get("date"));
    if (!amount || amount <= 0 || !date) return;

    const optimistic: TransactionRow = {
      id: `temp-${crypto.randomUUID()}`,
      type,
      amount,
      category: type === "expense" ? String(fd.get("category") || "") : null,
      client_id: type === "income" ? String(fd.get("clientId") || "") || null : null,
      date,
      note: String(fd.get("note") || ""),
    };
    setTransactions((prev) => [optimistic, ...prev]);
    form.reset();
    startTransition(() => {
      addTransaction(fd);
    });
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    startTransition(() => {
      deleteTransaction(id);
    });
  }

  function handleAddCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;

    const optimistic: CategoryRow = { id: `temp-${crypto.randomUUID()}`, name, created_at: new Date().toISOString() };
    setCategories((prev) => [...prev, optimistic]);
    setAddingCategory(false);
    startTransition(() => {
      addCategory(fd);
    });
  }

  function handleDeleteCategory(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    startTransition(() => {
      deleteCategory(id);
    });
  }

  return (
    <>
      <Section eyebrow="новая запись" title="Добавить операцию">
        <form onSubmit={handleAdd}>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150 active:scale-[0.98] ${
                type === "expense" ? "bg-ink text-white" : "bg-bg text-inkSoft"
              }`}
            >
              Расход
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-150 active:scale-[0.98] ${
                type === "income" ? "bg-ink text-white" : "bg-bg text-inkSoft"
              }`}
            >
              Доход
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Сумма, ₸">
              <input name="amount" type="number" step="0.01" placeholder="0" className={inputClass} required />
            </Field>
            <Field label="Дата">
              <input name="date" type="date" defaultValue={todayISO()} className={inputClass} required />
            </Field>

            {type === "expense" ? (
              <Field label="Категория">
                <select name="category" className={inputClass}>
                  {allCategories.map((c) => (
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

          {type === "expense" && (
            <div className="mb-4">
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {categories.map((c) => (
                    <span
                      key={c.id}
                      className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-[12px] font-medium bg-segment text-inkSoft animate-fade-in"
                    >
                      {c.name}
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(c.id)}
                        title="Удалить категорию"
                        className="transition-transform active:scale-90"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {addingCategory ? (
                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <input name="name" autoFocus placeholder="Название категории" className={`${inputClass} flex-1`} required />
                  <button
                    type="submit"
                    className="px-3 rounded-xl text-[13px] font-semibold bg-ink text-white transition-all duration-150 active:scale-95"
                  >
                    ОК
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingCategory(false)}
                    className="px-3 rounded-xl text-[13px] font-semibold bg-bg text-inkSoft transition-all duration-150 active:scale-95"
                  >
                    Отмена
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingCategory(true)}
                  className="text-[12px] font-semibold flex items-center gap-1 text-accentBlue transition-opacity active:opacity-60"
                >
                  <Plus size={13} /> Своя категория
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-1.5 bg-accentBlue text-white transition-all duration-150 active:scale-[0.98]"
          >
            <Plus size={16} /> Добавить
          </button>
        </form>
      </Section>

      <Section eyebrow={`${transactions.length} записей`} title="История">
        <div className="flex flex-col">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center gap-3 py-3 border-b border-line animate-fade-in">
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
              <button onClick={() => handleDelete(t.id)} className="shrink-0 transition-transform active:scale-90">
                <Trash2 size={14} className="text-inkFaint" />
              </button>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
