"use client";

import { Plus } from "lucide-react";
import { Section, Field, inputClass, PrimaryButton } from "@/components/ui";
import { addTask } from "@/actions/tasks";
import { daysFromToday } from "@/lib/format";

export function TasksForm() {
  return (
    <Section eyebrow="новая задача" title="Добавить задачу">
      <form action={addTask}>
        <div className="grid grid-cols-[1fr_auto] gap-3 mb-4">
          <Field label="Задача">
            <input name="title" placeholder="Что нужно сделать" className={inputClass} required />
          </Field>
          <Field label="Срок">
            <input name="due" type="date" defaultValue={daysFromToday(1)} className={inputClass} required />
          </Field>
        </div>
        <PrimaryButton type="submit">
          <Plus size={16} /> Добавить задачу
        </PrimaryButton>
      </form>
    </Section>
  );
}
