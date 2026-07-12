import { createClient } from "@/lib/supabase/server";
import { StudentsSection } from "./StudentsSection";
import type { StudentRow } from "@/lib/types";

export default async function StudentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: students } = await supabase
    .from("students")
    .select("*")
    .eq("user_id", user!.id)
    .order("test_date", { ascending: false, nullsFirst: false });

  return <StudentsSection initialStudents={(students as StudentRow[]) || []} />;
}
