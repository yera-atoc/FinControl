"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Section, Field, inputClass } from "@/components/ui";
import { addStudent, updateStudent, deleteStudent } from "@/actions/students";
import { formatMoney } from "@/lib/format";
import type { StudentRow } from "@/lib/types";

const MONTH_NAMES = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

function monthKey(dateStr: string | null) {
  if (!dateStr) return null;
  return dateStr.slice(0, 7);
}

function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

export function StudentsSection({ initialStudents }: { initialStudents: StudentRow[] }) {
  const [students, setStudents] = useState(initialStudents);
  const [, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;

    const optimistic: StudentRow = {
      id: `temp-${crypto.randomUUID()}`,
      name,
      phone: String(fd.get("phone") || "") || null,
      test_date: String(fd.get("test_date") || "") || null,
      result: "",
      paid: parseFloat(String(fd.get("paid") || "0")) || 0,
      created_at: new Date().toISOString(),
    };
    setStudents((prev) => [optimistic, ...prev]);
    form.reset();
    startTransition(() => {
      addStudent(fd);
    });
  }

  function handleBlur(student: StudentRow, field: keyof StudentRow, value: string) {
    const current = String((student as any)[field] ?? "");
    if (current === value) return;

    setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, [field]: value } : s)));

    const fd = new FormData();
    fd.set("id", student.id);
    fd.set("name", field === "name" ? value : student.name);
    fd.set("phone", field === "phone" ? value : student.phone || "");
    fd.set("test_date", field === "test_date" ? value : student.test_date || "");
    fd.set("result", field === "result" ? value : student.result || "");
    fd.set("paid", field === "paid" ? value : String(student.paid ?? 0));
    startTransition(() => {
      updateStudent(fd);
    });
  }

  function handleDelete(id: string) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    startTransition(() => {
      deleteStudent(id);
    });
  }

  const byMonth: Record<string, { count: number; total: number }> = {};
  students.forEach((s) => {
    const k = monthKey(s.test_date);
    if (!k) return;
    if (!byMonth[k]) byMonth[k] = { count: 0, total: 0 };
    byMonth[k].count += 1;
    byMonth[k].total += Number(s.paid) || 0;
  });
  const monthKeys = Object.keys(byMonth).sort().reverse();
  const currentKey = new Date().toISOString().slice(0, 7);
  const current = byMonth[currentKey] || { count: 0, total: 0 };
  const totalPaid = students.reduce((a, s) => a + (Number(s.paid) || 0), 0);

  return (
    <>
      <Section eyebrow="новый ученик" title="Добавить ученика">
        <form onSubmit={handleAdd}>
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
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-1.5 bg-accentBlue text-white transition-all duration-150 active:scale-[0.98]"
          >
            <Plus size={16} /> Добавить ученика
          </button>
        </form>
      </Section>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="rounded-2xl p-4 bg-card animate-fade-in"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.03)" }}
        >
          <div className="text-[11px] font-medium uppercase tracking-wide mb-1 text-inkFaint">
            Учеников в этом месяце
          </div>
          <div className="text-[22px] font-bold text-ink">{current.count}</div>
        </div>
        <div
          className="rounded-2xl p-4 bg-card animate-fade-in"
          style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.03)" }}
        >
          <div className="text-[11px] font-medium uppercase tracking-wide mb-1 text-inkFaint">
            Оплачено в этом месяце
          </div>
          <div className="text-[22px] font-bold text-ink font-mono">{formatMoney(current.total)}</div>
        </div>
      </div>

      <Section eyebrow={`всего ${students.length}`} title="Мои ученики">
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-[13px] min-w-[640px]">
            <thead>
              <tr className="text-left text-[11px] font-medium uppercase tracking-wide text-inkFaint">
                <th className="pb-2 px-1">Имя</th>
                <th className="pb-2 px-1">Телефон</th>
                <th className="pb-2 px-1 w-32">Дата теста</th>
                <th className="pb-2 px-1 w-20">Балл</th>
                <th className="pb-2 px-1 w-28">Оплата</th>
                <th className="pb-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-[13px] text-inkSoft">
                    Пока нет учеников. Добавьте первого выше.
                  </td>
                </tr>
              )}
              {students.map((s) => (
                <tr key={s.id} className="border-t border-line animate-fade-in">
                  <td className="px-1 py-1">
                    <input
                      defaultValue={s.name}
                      onBlur={(e) => handleBlur(s, "name", e.target.value)}
                      className={`${inputClass} bg-transparent px-2 py-1.5`}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      defaultValue={s.phone || ""}
                      onBlur={(e) => handleBlur(s, "phone", e.target.value)}
                      placeholder="+7 700 000 00 00"
                      className={`${inputClass} bg-transparent px-2 py-1.5`}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="date"
                      defaultValue={s.test_date || ""}
                      onBlur={(e) => handleBlur(s, "test_date", e.target.value)}
                      className={`${inputClass} bg-transparent px-2 py-1.5`}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      defaultValue={s.result || ""}
                      onBlur={(e) => handleBlur(s, "result", e.target.value)}
                      placeholder="Балл"
                      className={`${inputClass} bg-transparent px-2 py-1.5`}
                    />
                  </td>
                  <td className="px-1 py-1">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={s.paid ?? 0}
                      onBlur={(e) => handleBlur(s, "paid", e.target.value)}
                      className={`${inputClass} bg-transparent px-2 py-1.5`}
                    />
                  </td>
                  <td className="px-1 py-1 text-center">
                    <button onClick={() => handleDelete(s.id)} title="Удалить" className="transition-transform active:scale-90">
                      <Trash2 size={14} className="text-inkFaint" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {monthKeys.length > 0 && (
        <Section eyebrow="сводка" title="По месяцам">
          <div className="flex flex-col">
            {monthKeys.map((k) => (
              <div key={k} className="flex items-center justify-between py-2.5 border-b border-line last:border-0">
                <span className="text-[13px] text-inkSoft capitalize">{monthLabel(k)}</span>
                <span className="text-[13px] text-ink">{byMonth[k].count} учеников</span>
                <span className="text-[13px] font-mono font-semibold text-accentGreen">
                  {formatMoney(byMonth[k].total)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-line">
              <span className="text-[13px] font-semibold text-ink">Всего оплачено</span>
              <span className="text-[13px] font-mono font-semibold text-accentGreen">{formatMoney(totalPaid)}</span>
            </div>
          </div>
        </Section>
      )}
    </>
  );
}
