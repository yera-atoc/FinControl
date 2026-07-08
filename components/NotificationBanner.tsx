"use client";

import { useState } from "react";
import { Bell, X } from "lucide-react";
import type { TaskRow } from "@/lib/types";
import { daysFromToday, todayISO } from "@/lib/format";

export function NotificationBanner({ tasks }: { tasks: TaskRow[] }) {
  const [show, setShow] = useState(true);

  const overdue = tasks.filter((t) => !t.done && t.due < todayISO());
  const tomorrow = tasks.filter((t) => !t.done && t.due === daysFromToday(1));
  const thisWeek = tasks.filter((t) => {
    if (t.done) return false;
    return t.due >= todayISO() && t.due <= daysFromToday(7);
  });

  if (!show || (overdue.length === 0 && tomorrow.length === 0 && thisWeek.length === 0)) return null;

  return (
    <div className="rounded-2xl p-4 mb-5 flex items-start gap-3 bg-accentOrangeSoft">
      <Bell size={17} className="mt-0.5 shrink-0 text-accentOrange" />
      <div className="flex-1 text-[13px] leading-relaxed text-ink">
        {overdue.length > 0 && (
          <div className="mb-1">
            <span className="font-semibold text-accentRed">Просрочено ({overdue.length}):</span>{" "}
            {overdue.map((t) => t.title).join(", ")}
          </div>
        )}
        {tomorrow.length > 0 && (
          <div className="mb-1">
            <span className="font-semibold">Завтра:</span> {tomorrow.map((t) => t.title).join(", ")}
          </div>
        )}
        {thisWeek.length > 0 && (
          <div>
            <span className="font-semibold">На этой неделе ({thisWeek.length}):</span>{" "}
            {thisWeek.map((t) => t.title).join(", ")}
          </div>
        )}
      </div>
      <button onClick={() => setShow(false)} className="shrink-0">
        <X size={15} className="text-inkFaint" />
      </button>
    </div>
  );
}
