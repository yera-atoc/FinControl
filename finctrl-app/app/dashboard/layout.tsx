import { Wallet, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/Nav";
import { NotificationBanner } from "@/components/NotificationBanner";
import { redirect } from "next/navigation";
import type { TaskRow } from "@/lib/types";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due", { ascending: true });

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[12px] font-medium tracking-wide text-inkFaint">финансы под контролем</div>
            <h1 className="text-[26px] font-bold tracking-tight text-ink">FinCtrl</h1>
          </div>
          <div className="flex items-center gap-2">
            <form action={signOut}>
              <button
                type="submit"
                className="w-11 h-11 rounded-2xl flex items-center justify-center bg-segment text-inkSoft"
                title="Выйти"
              >
                <LogOut size={18} />
              </button>
            </form>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-ink">
              <Wallet size={20} color="#fff" />
            </div>
          </div>
        </div>

        <NotificationBanner tasks={(tasks as TaskRow[]) || []} />
        <Nav />
        {children}

        <div className="text-center text-[12px] mt-6 pb-2 text-inkFaint">
          {user.email}
        </div>
      </div>
    </div>
  );
}
