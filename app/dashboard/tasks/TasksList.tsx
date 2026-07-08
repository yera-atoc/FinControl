"use client";

import { CheckCircle2, Square, Calendar, Trash2 } from "lucide-react";
import { Section, Badge } from "@/components/ui";
import { toggleTask, deleteTask } from "@/actions/tasks";
import { formatDateShort, todayISO, daysFromToday } from "@/lib/format";
import type { TaskRow } from "@/lib/types";

export function TasksList({ tasks }: { tasks: TaskRow[] }) {
  const active = tasks.filter((t) => !t.done).length;

  return (
    <Section eyebrow={`${active} активных`} title="Список задач">
      <div className="flex flex-col">
        {tasks.map((t) => {
          const isOverdue = !t.done && t.due < todayISO();
          const isTomorrow = t.due === daysFromToday(1);
          return (
            <div key={t.id} className="flex items-center gap-3 py-3 border-b border-line" style={{ opacity: t.done ? 0.45 : 1 }}>
              <form action={toggleTask.bind(null, t.id, t.done)}>
                <button type="submit" className="shrink-0">
                  {t.done ? <CheckCircle2 size={19} className="text-accentGreen" /> : <Square size={19} className="text-inkFaint" />}
                </button>
              </form>
              <div className="flex-1 min-w-0">
                <div className={`text-[14px] font-medium ${t.done ? "line-through" : ""}`}>{t.title}</div>
                <div className="flex items-center gap-1.5 text-[12px] mt-0.5 text-inkSoft">
                  <Calendar size={11} />
                  {formatDateShort(t.due)}
                  {isOverdue && <Badge tone="red">просрочено</Badge>}
                  {!isOverdue && isTomorrow && <Badge tone="orange">завтра</Badge>}
                </div>
              </div>
              <form action={deleteTask.bind(null, t.id)}>
                <button type="submit" className="shrink-0">
                  <Trash2 size={14} className="text-inkFaint" />
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
