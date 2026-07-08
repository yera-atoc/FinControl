import { createClient } from "@/lib/supabase/server";
import { TasksForm } from "./TasksForm";
import { TasksList } from "./TasksList";
import type { TaskRow } from "@/lib/types";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user!.id)
    .order("due", { ascending: true });

  return (
    <>
      <TasksForm />
      <TasksList tasks={(tasks as TaskRow[]) || []} />
    </>
  );
}
