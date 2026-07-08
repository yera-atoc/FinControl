"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { inputClass, PrimaryButton, Field } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      router.push("/dashboard");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setLoading(false);
      if (error) return setError(error.message);
      setInfo("Проверьте почту — мы отправили ссылку для подтверждения регистрации.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-ink mb-3">
            <Wallet size={22} color="#fff" />
          </div>
          <h1 className="text-[24px] font-bold text-ink">FinCtrl</h1>
          <p className="text-[13px] text-inkSoft">финансы под контролем</p>
        </div>

        <div className="bg-card rounded-2xl p-6" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 1px 8px rgba(0,0,0,0.03)" }}>
          <div className="flex gap-0.5 p-1 rounded-xl mb-5 bg-segment">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold ${mode === "signin" ? "bg-card text-ink shadow-sm" : "text-inkSoft"}`}
            >
              Вход
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold ${mode === "signup" ? "bg-card text-ink shadow-sm" : "text-inkSoft"}`}
            >
              Регистрация
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Пароль">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </Field>

            {error && <p className="text-[13px] text-accentRed">{error}</p>}
            {info && <p className="text-[13px] text-accentGreen">{info}</p>}

            <PrimaryButton type="submit">
              {loading ? "Подождите…" : mode === "signin" ? "Войти" : "Создать аккаунт"}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
