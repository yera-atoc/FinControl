"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Section, Field, inputClass } from "@/components/ui";
import { addAccount, updateAccount, deleteAccount } from "@/actions/accounts";
import { formatMoney } from "@/lib/format";
import type { AccountRow } from "@/lib/types";

export function AccountsSection({ initialAccounts }: { initialAccounts: AccountRow[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;

    const optimistic: AccountRow = {
      id: `temp-${crypto.randomUUID()}`,
      name,
      bank: String(fd.get("bank") || "") || null,
      balance: parseFloat(String(fd.get("balance") || "0")) || 0,
      created_at: new Date().toISOString(),
    };
    setAccounts((prev) => [...prev, optimistic]);
    form.reset();
    startTransition(() => {
      addAccount(fd);
    });
  }

  function handleBlur(acc: AccountRow, field: keyof AccountRow, value: string) {
    const current = String((acc as any)[field] ?? "");
    if (current === value) return;

    setAccounts((prev) => prev.map((a) => (a.id === acc.id ? { ...a, [field]: value } : a)));

    const fd = new FormData();
    fd.set("id", acc.id);
    fd.set("name", field === "name" ? value : acc.name);
    fd.set("bank", field === "bank" ? value : acc.bank || "");
    fd.set("balance", field === "balance" ? value : String(acc.balance ?? 0));
    startTransition(() => {
      updateAccount(fd);
    });
  }

  function handleDelete(id: string) {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    startTransition(() => {
      deleteAccount(id);
    });
  }

  const total = accounts.reduce((a, x) => a + (Number(x.balance) || 0), 0);

  return (
    <>
      <Section eyebrow="новый счёт" title="Добавить счёт">
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Название">
              <input name="name" placeholder="Например: Основная карта" className={inputClass} required />
            </Field>
            <Field label="Банк / вид">
              <input name="bank" placeholder="Kaspi, Halyk, наличные..." className={inputClass} />
            </Field>
          </div>
          <div className="mb-4">
            <Field label="Баланс, ₸">
              <input name="balance" type="number" step="0.01" placeholder="0" className={inputClass} />
            </Field>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-1.5 bg-accentBlue text-white transition-all duration-150 active:scale-[0.98]"
          >
            <Plus size={16} /> Добавить счёт
          </button>
        </form>
      </Section>

      <div
        className="rounded-2xl p-4 mb-4 bg-card animate-fade-in"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.03)" }}
      >
        <div className="text-[11px] font-medium uppercase tracking-wide mb-1 text-inkFaint">
          Всего на всех счетах
        </div>
        <div className="text-[24px] font-bold font-mono text-ink">{formatMoney(total)}</div>
      </div>

      <Section eyebrow={`всего ${accounts.length}`} title="Мои счета">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[13px] min-w-[480px]">
            <thead>
              <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-inkFaint">
                <th className="pb-2 px-1">Название</th>
                <th className="pb-2 px-1">Банк / вид</th>
                <th className="pb-2 px-1 w-32">Баланс</th>
                <th className="pb-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[13px] text-inkSoft">
                    Пока нет счетов. Добавьте первый выше.
                  </td>
                </tr>
              )}
              {accounts.map((a) => (
                <tr key={a.id} className="border-t border-line animate-fade-in">
                  <td className="px-1 py-1">
                    <input
                      defaultValue={a.name}
                      onBlur={(e) => handleBlur(a, "name", e.target.value)}
                      className={`${inputClass} bg-transparent px-2 py-1.5`}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      defaultValue={a.bank || ""}
                      onBlur={(e) => handleBlur(a, "bank", e.target.value)}
                      placeholder="Kaspi, Halyk..."
                      className={`${inputClass} bg-transparent px-2 py-1.5`}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={a.balance ?? 0}
                      onBlur={(e) => handleBlur(a, "balance", e.target.value)}
                      className={`${inputClass} bg-transparent px-2 py-1.5 font-mono`}
                    />
                  </td>
                  <td className="px-1 py-1 text-center">
                    <button onClick={() => handleDelete(a.id)} title="Удалить" className="transition-transform active:scale-90">
                      <Trash2 size={14} className="text-inkFaint" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
