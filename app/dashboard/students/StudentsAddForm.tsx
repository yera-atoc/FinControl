"use client";

import { Plus } from "lucide-react";
import { Section, Field, inputClass, PrimaryButton } from "@/components/ui";
import { addStudent } from "@/actions/students";

export function StudentsAddForm() {
  return (
    <Section eyebrow="новый ученик" title="Добавить ученика">
      <form action={addStudent}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Имя">
            <input name="name" placeholder="Имя ученика" className={inputClass} required />
          </Field>
          <Field label="Телефон">
            <input name="phone" placeholder="+7 700 000 00 00" className={inputClass} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Field label="Дата сдачи теста">
            <input name="test_date" type="date" className={inputClass} />
          </Field>
          <Field label="Оплата, ₸">
            <input name="paid" type="number" step="0.01" placeholder="0" className={inputClass} />
          </Field>
        </div>
        <PrimaryButton type="submit">
          <Plus size={16} /> Добавить ученика
        </PrimaryButton>
      </form>
    </Section>
  );
}
