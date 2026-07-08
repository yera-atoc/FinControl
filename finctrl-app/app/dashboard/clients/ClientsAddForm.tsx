"use client";

import { Plus } from "lucide-react";
import { Section, Field, inputClass, PrimaryButton } from "@/components/ui";
import { addClient } from "@/actions/clients";

export function ClientsAddForm() {
  return (
    <Section eyebrow="новый клиент" title="Добавить клиента">
      <form action={addClient}>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Field label="Название / имя">
            <input name="name" placeholder="Например: AtoC IELTS" className={inputClass} required />
          </Field>
          <Field label="Контакт (необязательно)">
            <input name="contact" placeholder="Телефон / Telegram" className={inputClass} />
          </Field>
        </div>
        <PrimaryButton type="submit">
          <Plus size={16} /> Добавить клиента
        </PrimaryButton>
      </form>
    </Section>
  );
}
