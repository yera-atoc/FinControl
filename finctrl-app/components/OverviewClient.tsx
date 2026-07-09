"use client";

import { useMemo, useState } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Section, Segmented, BalancePill } from "@/components/ui";
import { formatMoney } from "@/lib/format";
import type { ClientRow, TransactionRow } from "@/lib/types";

type Period = "week" | "month" | "year";

function periodStart(period: Period) {
  const d = new Date();
  if (period === "week") d.setDate(d.getDate() - 6);
  if (period === "month") d.setDate(d.getDate() - 29);
  if (period === "year") d.setDate(d.getDate() - 364);
  d.setHours(0, 0, 0, 0);
  return d;
}

function periodLengthDays(period: Period) {
  return { week: 7, month: 30, year: 365 }[period];
}

function monthLabel(offset: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - offset);
  return d.toLocaleDateString("ru-RU", { month: "short" });
}

export function OverviewClient({
  transactions,
  clients,
}: {
  transactions: TransactionRow[];
  clients: ClientRow[];
}) {
  const [period, setPeriod] = useState<Period>("month");

  const clientMap = useMemo(() => {
    const m: Record<string, ClientRow> = {};
    clients.forEach((c) => (m[c.id] = c));
    return m;
  }, [clients]);

  const periodTx = useMemo(() => {
    const start = periodStart(period);
    return transactions.filter((t) => new Date(t.date + "T00:00:00") >= start);
  }, [transactions, period]);

  const prevPeriodTx = useMemo(() => {
    const start = periodStart(period);
    const days = periodLengthDays(period);
    const prevStart = new Date(start);
    prevStart.setDate(prevStart.getDate() - days);
    return transactions.filter((t) => {
      const d = new Date(t.date + "T00:00:00");
      return d >= prevStart && d < start;
    });
  }, [transactions, period]);

  const totals = useMemo(() => {
    let income = 0, expense = 0;
    periodTx.forEach((t) => (t.type === "income" ? (income += t.amount) : (expense += t.amount)));
    return { income, expense, net: income - expense };
  }, [periodTx]);

  const prevTotals = useMemo(() => {
    let income = 0, expense = 0;
    prevPeriodTx.forEach((t) => (t.type === "income" ? (income += t.amount) : (expense += t.amount)));
    return { income, expense };
  }, [prevPeriodTx]);

  const expenseByCategory = useMemo(() => {
    const m: Record<string, number> = {};
    periodTx
      .filter((t) => t.type === "expense")
      .forEach((t) => (m[t.category || "Прочее"] = (m[t.category || "Прочее"] || 0) + t.amount));
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [periodTx]);

  const incomeByClient = useMemo(() => {
    const m: Record<string, number> = {};
    periodTx
      .filter((t) => t.type === "income")
      .forEach((t) => {
        const name = (t.client_id && clientMap[t.client_id]?.name) || "Без клиента";
        m[name] = (m[name] || 0) + t.amount;
      });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [periodTx, clientMap]);

  const monthlyTrend = useMemo(() => {
    const arr = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date();
      start.setMonth(start.getMonth() - i, 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      let income = 0, expense = 0;
      transactions.forEach((t) => {
        const d = new Date(t.date + "T00:00:00");
        if (d >= start && d < end) {
          if (t.type === "income") income += t.amount;
          else expense += t.amount;
        }
      });
      arr.push({ label: monthLabel(i), income, expense });
    }
    return arr;
  }, [transactions]);

  const maxTrend = Math.max(1, ...monthlyTrend.flatMap((m) => [m.income, m.expense]));
  const periodLabel = { week: "неделя", month: "месяц", year: "год" }[period];
  const prevPeriodLabel = { week: "прошлой неделе", month: "прошлому месяцу", year: "прошлому году" }[period];

  const topCategory = expenseByCategory[0];
  const topCategoryShare = topCategory && totals.expense > 0 ? (topCategory[1] / totals.expense) * 100 : 0;

  const expenseChangePct =
    prevTotals.expense > 0 ? ((totals.expense - prevTotals.expense) / prevTotals.expense) * 100 : null;

  return (
    <>
      <Segmented
        options={[
          { id: "week", label: "Неделя" },
          { id: "month", label: "Месяц" },
          { id: "year", label: "Год" },
        ]}
        value={period}
        onChange={setPeriod}
      />

      <Section eyebrow={`итог · ${periodLabel}`} title="Баланс">
        <div className="flex items-center gap-4">
          <BalancePill net={totals.net} />
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div>
              <div className="text-[12px] mb-1 flex items-center gap-1 text-inkSoft">
                <TrendingUp size={12} className="text-accentGreen" /> Доход
              </div>
              <div className="text-[19px] font-bold font-mono text-ink">{formatMoney(totals.income)}</div>
            </div>
            <div>
              <div className="text-[12px] mb-1 flex items-center gap-1 text-inkSoft">
                <TrendingDown size={12} className="text-accentRed" /> Расход
              </div>
              <div className="text-[19px] font-bold font-mono text-ink">{formatMoney(totals.expense)}</div>
            </div>
          </div>
        </div>
      </Section>

      <Section eyebrow="последние 6 месяцев" title="Динамика">
        <div className="flex items-end gap-3 h-32">
          {monthlyTrend.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex items-end gap-1 h-24 w-full justify-center">
                <div
                  style={{ height: `${(m.income / maxTrend) * 100}%`, width: 9, borderRadius: 5 }}
                  className="bg-accentGreen"
                  title={formatMoney(m.income)}
                />
                <div
                  style={{ height: `${(m.expense / maxTrend) * 100}%`, width: 9, borderRadius: 5 }}
                  className="bg-line"
                  title={formatMoney(m.expense)}
                />
              </div>
              <span className="text-[11px] font-medium text-inkFaint">{m.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow={periodLabel} title="Анализ трат">
        {totals.expense === 0 ? (
          <p className="text-[13px] text-inkSoft">Пока нет расходов за этот период — анализировать нечего.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {topCategory && (
              <div className="rounded-xl p-3 bg-bg">
                <div className="text-[11px] mb-1 text-inkFaint">Больше всего потрачено на</div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-ink">{topCategory[0]}</span>
                  <span className="text-[14px] font-mono font-semibold text-ink">
                    {formatMoney(topCategory[1])}
                  </span>
                </div>
                <div className="text-[12px] mt-0.5 text-inkSoft">
                  {topCategoryShare.toFixed(0)}% от всех расходов за {periodLabel}
                </div>
              </div>
            )}

            {expenseChangePct !== null && (
              <div className="rounded-xl p-3 bg-bg">
                <div className="text-[11px] mb-1 text-inkFaint">Расходы по сравнению с {prevPeriodLabel}</div>
                <div className="flex items-center gap-1.5">
                  {expenseChangePct > 0 ? (
                    <ArrowUpRight size={16} className="text-accentRed" />
                  ) : (
                    <ArrowDownRight size={16} className="text-accentGreen" />
                  )}
                  <span
                    className={`text-[16px] font-bold font-mono ${
                      expenseChangePct > 0 ? "text-accentRed" : "text-accentGreen"
                    }`}
                  >
                    {expenseChangePct > 0 ? "+" : ""}
                    {expenseChangePct.toFixed(0)}%
                  </span>
                  <span className="text-[12px] text-inkSoft">
                    {expenseChangePct > 0 ? "потратили больше" : "потратили меньше"}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </Section>

      <Section eyebrow={periodLabel} title="Расходы по категориям">
        {expenseByCategory.length === 0 && <p className="text-[13px] text-inkSoft">Пока нет расходов за этот период.</p>}
        {expenseByCategory.map(([cat, sum]) => (
          <div key={cat} className="flex items-center gap-3 mb-2.5">
            <span className="text-[13px] w-24 shrink-0 font-medium">{cat}</span>
            <div className="flex-1 h-1.5 rounded-full bg-segment">
              <div
                className="h-1.5 rounded-full bg-ink"
                style={{ width: `${(sum / (expenseByCategory[0]?.[1] || 1)) * 100}%` }}
              />
            </div>
            <span className="text-[12px] w-24 text-right shrink-0 font-mono text-inkSoft">{formatMoney(sum)}</span>
          </div>
        ))}
      </Section>

      <Section eyebrow={periodLabel} title="Доход по клиентам">
        {incomeByClient.length === 0 && <p className="text-[13px] text-inkSoft">Пока нет дохода за этот период.</p>}
        {incomeByClient.map(([name, sum]) => (
          <div key={name} className="flex items-center gap-3 mb-2.5">
            <span className="text-[13px] flex-1 truncate font-medium">{name}</span>
            <span className="text-[13px] shrink-0 font-semibold font-mono text-accentGreen">{formatMoney(sum)}</span>
          </div>
        ))}
      </Section>
    </>
  );
}
