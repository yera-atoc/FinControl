export function formatMoney(n: number) {
  const sign = n < 0 ? "−" : "";
  const abs = Math.abs(Math.round(n));
  return sign + abs.toLocaleString("ru-RU") + " ₸";
}

export function formatDateShort(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short" });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function daysFromToday(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}
