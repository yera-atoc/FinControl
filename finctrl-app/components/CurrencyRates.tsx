import { getExchangeRates } from "@/lib/exchangeRates";
import { Section } from "@/components/ui";

export async function CurrencyRatesSection() {
  const rates = await getExchangeRates();
  if (rates.length === 0) return null;

  return (
    <Section eyebrow="нацбанк рк · официальный курс" title="Курсы валют">
      <div className="grid grid-cols-2 gap-3">
        {rates.map((r) => (
          <div key={r.code} className="rounded-xl p-3 bg-bg">
            <div className="text-[11px] mb-1 text-inkFaint">{r.name}</div>
            <div className="text-[17px] font-bold font-mono text-ink">
              {r.value.toFixed(2)} ₸
            </div>
            <div className="text-[11px] text-inkSoft">
              за {r.quant} {r.code}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
