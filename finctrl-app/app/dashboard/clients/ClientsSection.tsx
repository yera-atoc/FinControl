"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Section, Segmented, Field, inputClass, PrimaryButton } from "@/components/ui";
import { addClient, completeClient, deleteClient, reopenClient } from "@/actions/clients";
import { formatMoney } from "@/lib/format";
import type { ClientRow } from "@/lib/types";

export function ClientsSection({ initialClients }: { initialClients: ClientRow[] }) {
  const [clients, setClients] = useState(initialClients);
  const [tab, setTab] = useState<"new" | "completed">("new");
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const newClients = clients.filter((c) => c.status === "new");
  const doneClients = clients.filter((c) => c.status === "completed");

  function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    if (!name) return;

    const optimistic: ClientRow = {
      id: `temp-${crypto.randomUUID()}`,
      name,
      contact: String(fd.get("contact") || "") || null,
      status: "new",
      result: "",
      paid: 0,
      created_at: new Date().toISOString(),
    };
    setClients((prev) => [optimistic, ...prev]);
    form.reset();
    startTransition(() => {
      addClient(fd);
    });
  }

  function handleComplete(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("id", id);
    const result = String(fd.get("result") || "");
    const paid = parseFloat(String(fd.get("paid") || "0")) || 0;

    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status: "completed", result, paid } : c)));
    setCompletingId(null);
    startTransition(() => {
      completeClient(fd);
    });
  }

  function handleReopen(id: string) {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, status: "new" } : c)));
    startTransition(() => {
      reopenClient(id);
    });
  }

  function handleDelete(id: string) {
    setClients((prev) => prev.filter((c) => c.id !== id));
    startTransition(() => {
      deleteClient(id);
    });
  }

  return (
    <>
      <Section eyebrow="новый клиент" title="Добавить клиента">
        <form ref={formRef} onSubmit={handleAdd}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Field label="Название / имя">
              <input name="name" placeholder="Например: AtoC IELTS" className={inputClass} required />
            </Field>
            <Field label="Контакт (необязательно)">
              <input name="contact" placeholder="Телефон / Telegram" className={inputClass} />
            </Field>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-1.5 bg-accentBlue text-white transition-all duration-150 active:scale-[0.98]"
          >
            <Plus size={16} /> Добавить клиента
          </button>
        </form>
      </Section>

      <Segmented
        options={[
          { id: "new", label: `Новые (${newClients.length})` },
          { id: "completed", label: `Завершённые (${doneClients.length})` },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "new" && (
        <Section eyebrow="в работе" title="Новые клиенты">
          <div className="flex flex-col">
            {newClients.length === 0 && <p className="text-[13px] text-inkSoft">Пока нет новых клиентов.</p>}
            {newClients.map((c) => (
              <div key={c.id} className="py-3 border-b border-line animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{c.name}</div>
                    {c.contact && <div className="text-[12px] text-inkSoft">{c.contact}</div>}
                  </div>
                  {completingId !== c.id && (
                    <>
                      <button
                        onClick={() => setCompletingId(c.id)}
                        className="text-[12px] font-semibold px-3 py-1.5 rounded-lg shrink-0 bg-accentGreenSoft text-accentGreen transition-transform active:scale-95"
                      >
                        Завершить
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="shrink-0 transition-transform active:scale-90">
                        <Trash2 size={14} className="text-inkFaint" />
                      </button>
                    </>
                  )}
                </div>

                {completingId === c.id && (
                  <form
                    onSubmit={(e) => handleComplete(e, c.id)}
                    className="mt-3 grid grid-cols-2 gap-3 p-3 rounded-xl bg-bg"
                  >
                    <div className="col-span-2">
                      <Field label="Результат">
                        <input name="result" placeholder="Что сделано для клиента" className={`${inputClass} bg-card`} />
                      </Field>
                    </div>
                    <Field label="Сколько заплатили, ₸">
                      <input name="paid" type="number" step="0.01" placeholder="0" className={`${inputClass} bg-card`} />
                    </Field>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-accentBlue text-white transition-all active:scale-95"
                      >
                        Подтвердить
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompletingId(null)}
                        className="py-2.5 px-3 rounded-xl text-[13px] font-medium bg-card text-inkSoft transition-all active:scale-95"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {tab === "completed" && (
        <Section eyebrow="история" title="Клиенты завершённые">
          <div className="flex flex-col">
            {doneClients.length === 0 && <p className="text-[13px] text-inkSoft">Пока нет завершённых клиентов.</p>}
            {doneClients.map((c) => (
              <div key={c.id} className="py-3 border-b border-line animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{c.name}</div>
                    {c.result && <div className="text-[12px] mt-0.5 text-inkSoft">{c.result}</div>}
                  </div>
                  <span className="text-[14px] font-semibold shrink-0 font-mono text-accentGreen">{formatMoney(c.paid)}</span>
                  <button onClick={() => handleReopen(c.id)} className="shrink-0 transition-transform active:scale-90" title="Вернуть в новые">
                    <X size={14} className="text-inkFaint" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="shrink-0 transition-transform active:scale-90">
                    <Trash2 size={14} className="text-inkFaint" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
