"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { Section, Segmented, Field, inputClass } from "@/components/ui";
import { completeClient, deleteClient, reopenClient } from "@/actions/clients";
import { formatMoney } from "@/lib/format";
import type { ClientRow } from "@/lib/types";

export function ClientsLists({ clients }: { clients: ClientRow[] }) {
  const [tab, setTab] = useState<"new" | "completed">("new");
  const [completingId, setCompletingId] = useState<string | null>(null);

  const newClients = clients.filter((c) => c.status === "new");
  const doneClients = clients.filter((c) => c.status === "completed");

  return (
    <>
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
              <div key={c.id} className="py-3 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{c.name}</div>
                    {c.contact && <div className="text-[12px] text-inkSoft">{c.contact}</div>}
                  </div>
                  {completingId !== c.id && (
                    <>
                      <button
                        onClick={() => setCompletingId(c.id)}
                        className="text-[12px] font-semibold px-3 py-1.5 rounded-lg shrink-0 bg-accentGreenSoft text-accentGreen"
                      >
                        Завершить
                      </button>
                      <form action={deleteClient.bind(null, c.id)}>
                        <button type="submit" className="shrink-0">
                          <Trash2 size={14} className="text-inkFaint" />
                        </button>
                      </form>
                    </>
                  )}
                </div>

                {completingId === c.id && (
                  <form
                    action={async (formData: FormData) => {
                      await completeClient(formData);
                      setCompletingId(null);
                    }}
                    className="mt-3 grid grid-cols-2 gap-3 p-3 rounded-xl bg-bg"
                  >
                    <input type="hidden" name="id" value={c.id} />
                    <div className="col-span-2">
                      <Field label="Результат">
                        <input name="result" placeholder="Что сделано для клиента" className={`${inputClass} bg-card`} />
                      </Field>
                    </div>
                    <Field label="Сколько заплатили, ₸">
                      <input name="paid" type="number" step="0.01" placeholder="0" className={`${inputClass} bg-card`} />
                    </Field>
                    <div className="flex items-end gap-2">
                      <button type="submit" className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold bg-accentBlue text-white">
                        Подтвердить
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompletingId(null)}
                        className="py-2.5 px-3 rounded-xl text-[13px] font-medium bg-card text-inkSoft"
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
              <div key={c.id} className="py-3 border-b border-line">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{c.name}</div>
                    {c.result && <div className="text-[12px] mt-0.5 text-inkSoft">{c.result}</div>}
                  </div>
                  <span className="text-[14px] font-semibold shrink-0 font-mono text-accentGreen">{formatMoney(c.paid)}</span>
                  <form action={reopenClient.bind(null, c.id)}>
                    <button type="submit" className="shrink-0" title="Вернуть в новые">
                      <X size={14} className="text-inkFaint" />
                    </button>
                  </form>
                  <form action={deleteClient.bind(null, c.id)}>
                    <button type="submit" className="shrink-0">
                      <Trash2 size={14} className="text-inkFaint" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
