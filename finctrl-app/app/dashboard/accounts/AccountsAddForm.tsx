"use client";

import { Plus } from "lucide-react";
import { Section, Field, inputClass, PrimaryButton } from "@/components/ui";
import { addAccount } from "@/actions/accounts";

export function AccountsAddForm() {
  return (
    <Section eyebrow="новый счёт" title="Добавить счёт">
      <form action={addAccount}>
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
        <PrimaryButton type="submit">
          <Plus size={16} /> Добавить счёт
        </PrimaryButton>
      </form>
    </Section>
  );
}
