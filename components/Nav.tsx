"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, Wallet, Users, GraduationCap, CheckSquare } from "lucide-react";

const TABS = [
  { href: "/dashboard", label: "Обзор", icon: TrendingUp },
  { href: "/dashboard/operations", label: "Операции", icon: Wallet },
  { href: "/dashboard/clients", label: "Клиенты", icon: Users },
  { href: "/dashboard/students", label: "Ученики", icon: GraduationCap },
  { href: "/dashboard/tasks", label: "Задачи", icon: CheckSquare },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <div className="flex gap-0.5 mb-5 p-1 rounded-xl bg-segment overflow-x-auto">
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-semibold transition-all whitespace-nowrap ${
              active ? "bg-card text-ink shadow-sm" : "text-inkSoft"
            }`}
          >
            <t.icon size={14} />
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
