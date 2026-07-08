"use client";

import { formatMoney } from "@/lib/format";

export function Section({
  title,
  eyebrow,
  children,
  right,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 mb-4 bg-card"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.03)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          {eyebrow && (
            <div className="text-[11px] font-medium tracking-wide uppercase mb-0.5 text-inkFaint">
              {eyebrow}
            </div>
          )}
          <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-[12px] font-medium text-inkSoft">{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "px-3 py-2.5 rounded-xl outline-none bg-bg border border-transparent focus:border-accentBlue text-ink w-full";

export function PrimaryButton({
  children,
  type = "submit",
}: {
  children: React.ReactNode;
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      className="w-full py-3 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-1.5 bg-accentBlue text-white active:opacity-80 transition-opacity"
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "ink" }: { children: React.ReactNode; tone?: "green" | "red" | "orange" | "blue" | "ink" }) {
  const map: Record<string, string> = {
    green: "bg-accentGreenSoft text-accentGreen",
    red: "bg-accentRedSoft text-accentRed",
    orange: "bg-accentOrangeSoft text-accentOrange",
    blue: "bg-accentBlueSoft text-accentBlue",
    ink: "bg-segment text-inkSoft",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${map[tone]}`}>
      {children}
    </span>
  );
}

export function BalancePill({ net }: { net: number }) {
  const positive = net >= 0;
  return (
    <div
      className={`rounded-2xl px-4 py-3 flex flex-col items-center justify-center text-center shrink-0 ${
        positive ? "bg-accentGreenSoft" : "bg-accentRedSoft"
      }`}
      style={{ minWidth: 108 }}
    >
      <span className={`text-[10px] font-semibold tracking-wide uppercase ${positive ? "text-accentGreen" : "text-accentRed"}`}>
        {positive ? "Профицит" : "Дефицит"}
      </span>
      <span className={`text-base font-bold mt-0.5 font-mono ${positive ? "text-accentGreen" : "text-accentRed"}`}>
        {formatMoney(net)}
      </span>
    </div>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-0.5 p-1 rounded-xl mb-4 bg-segment w-fit">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all ${
            value === o.id ? "bg-card text-ink shadow-sm" : "text-inkSoft"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
