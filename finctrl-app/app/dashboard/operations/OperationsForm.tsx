"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Section, Field, inputClass, PrimaryButton, DeleteButton } from "@/components/ui";
import { addTransaction } from "@/actions/transactions";
import { addCategory, deleteCategory } from "@/actions/categories";
import { EXPENSE_CATEGORIES, type ClientRow, type CategoryRow } from "@/lib/types";
import { todayISO } from "@/lib/format";

export function OperationsForm({
  clients,
  customCategories,
}: {
  clients: ClientRow[];
  customCategories: CategoryRow[];
}) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [addingCategory, setAddingCategory] = useState(false);

  const allCategories = [...EXPENSE_CATEGORIES, ...customCategories.map((c) => c.name)];

  return (
    <Section eyebrow="новая запись" title="Добавить операцию">
      <form action={addTransaction}>
        <input type="hidden" name="type" value={type} />
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
            {customCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {customCategories.map((c) => (
                  <span
                    key={c.id}
                    className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-[12px] font-medium bg-segment text-inkSoft"
                  >
                    {c.name}
                    <form action={deleteCategory.bind(null, c.id)} className="inline-flex">
                      <button type="submit" title="Удалить категорию" className="transition-transform active:scale-90">
                        <X size={12} />
                      </button>
                    </form>
                  </span>
                ))}
              </div>
            )}

            {addingCategory ? (
              <form
                action={async (fd) => {
                  await addCategory(fd);
                  setAddingCategory(false);
                }}
                className="flex gap-2"
              >
                <input
                  name="name"
                  autoFocus
                  placeholder="Название категории"
                  className={`${inputClass} flex-1`}
                  required
                />
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

        <PrimaryButton type="submit">
          <Plus size={16} /> Добавить
        </PrimaryButton>
      </form>
    </Section>
  );
}
