"use client";

import { useState, useTransition } from "react";
import { Plus, CheckCircle2, Square, Calendar, Trash2 } from "lucide-react";
import { Section, Badge, Field, inputClass } from "@/components/ui";
import { addTask, toggleTask, deleteTask } from "@/actions/tasks";
import { formatDateShort, todayISO, daysFromToday } from "@/lib/format";
import type { TaskRow } from "@/lib/types";

export function TasksSection({ initialTasks }: { initialTasks: TaskRow[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [, startTransition] = useTransition();

  const active = tasks.filter((t) => !t.done).length;

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get("title") || "").trim();
    const due = String(fd.get("due") || "");
    if (!title || !due) return;

    const optimistic: TaskRow = { id: `temp-${crypto.randomUUID()}`, title, due, done: false };
    setTasks((prev) => [...prev, optimistic].sort((a, b) => a.due.localeCompare(b.due)));
    form.reset();
    startTransition(() => {
      addTask(fd);
    });
  }

  function handleToggle(id: string, done: boolean) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !done } : t)));
    startTransition(() => {
      toggleTask(id, done);
    });
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    startTransition(() => {
      deleteTask(id);
    });
  }

  return (
    <>
      <Section eyebrow="новая задача" title="Добавить задачу">
        <form onSubmit={handleAdd}>
          <div className="grid grid-cols-[1fr_auto] gap-3 mb-4">
            <Field label="Задача">
              <input name="title" placeholder="Что нужно сделать" className={inputClass} required />
            </Field>
            <Field label="Срок">
              <input name="due" type="date" defaultValue={daysFromToday(1)} className={inputClass} required />
            </Field>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-1.5 bg-accentBlue text-white transition-all duration-150 active:scale-[0.98]"
          >
            <Plus size={16} /> Добавить задачу
          </button>
        </form>
      </Section>

      <Section eyebrow={`${active} активных`} title="Список задач">
        <div className="flex flex-col">
          {tasks.map((t) => {
            const isOverdue = !t.done && t.due < todayISO();
            const isTomorrow = t.due === daysFromToday(1);
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 py-3 border-b border-line animate-fade-in transition-opacity duration-200"
                style={{ opacity: t.done ? 0.45 : 1 }}
              >
                <button onClick={() => handleToggle(t.id, t.done)} className="shrink-0 transition-transform active:scale-90">
                  {t.done ? <CheckCircle2 size={19} className="text-accentGreen" /> : <Square size={19} className="text-inkFaint" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-[14px] font-medium ${t.done ? "line-through" : ""}`}>{t.title}</div>
                  <div className="flex items-center gap-1.5 text-[12px] mt-0.5 text-inkSoft">
                    <Calendar size={11} />
                    {formatDateShort(t.due)}
                    {isOverdue && <Badge tone="red">просрочено</Badge>}
                    {!isOverdue && isTomorrow && <Badge tone="orange">завтра</Badge>}
                  </div>
                </div>
                <button onClick={() => handleDelete(t.id)} className="shrink-0 transition-transform active:scale-90">
                  <Trash2 size={14} className="text-inkFaint" />
                </button>
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
