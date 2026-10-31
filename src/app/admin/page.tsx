import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminClient } from "@/components/AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN" || !session.accessToken) redirect("/login");
  return <main className="admin-page"><AdminClient accessToken={session.accessToken} /></main>;
}
