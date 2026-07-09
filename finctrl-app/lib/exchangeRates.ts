export type Rate = {
  code: string;
  name: string;
  value: number;
  quant: number;
};

const NAMES: Record<string, string> = {
  USD: "Доллар США",
  EUR: "Евро",
  RUB: "Российский рубль",
  CNY: "Китайский юань",
};

const CODES = ["USD", "EUR", "RUB", "CNY"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

async function fetchForDate(fdate: string): Promise<Rate[]> {
  const res = await fetch(`https://nationalbank.kz/rss/get_rates.cfm?fdate=${fdate}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const xml = await res.text();

  const rates: Rate[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml))) {
    const block = match[1];
    const code = /<title>(.*?)<\/title>/.exec(block)?.[1]?.trim() || "";
    if (!CODES.includes(code)) continue;
    const value = parseFloat(/<description>(.*?)<\/description>/.exec(block)?.[1] || "0");
    const quant = parseInt(/<quant>(.*?)<\/quant>/.exec(block)?.[1] || "1", 10);
    if (!value) continue;
    rates.push({ code, name: NAMES[code] || code, value, quant });
  }
  return rates;
}

/**
 * Fetches official KZT exchange rates from the National Bank of Kazakhstan.
 * Falls back to previous days if today's rate isn't published yet
 * (weekends / holidays).
 */
export async function getExchangeRates(): Promise<Rate[]> {
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const fdate = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
    try {
      const rates = await fetchForDate(fdate);
      if (rates.length > 0) {
        return CODES.map((c) => rates.find((r) => r.code === c)).filter(Boolean) as Rate[];
      }
    } catch {
      // try earlier date
    }
  }
  return [];
}
