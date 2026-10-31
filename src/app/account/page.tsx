import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { accountFetch, type Account } from "@/lib/account";
import { SiteShell } from "@/components/SiteShell";
import { ProfileForm } from "@/components/ProfileForm";
export default async function AccountPage() { const session = await auth(); if (!session) redirect("/login"); let account: Account; try { account = await accountFetch<Account>("/me"); } catch { redirect("/login"); } return <SiteShell><section className="account-panel"><p className="eyebrow">Your account</p><h1>{account.email}</h1><p className="account-status">{account.emailVerifiedAt ? "Email verified" : "Email verification pending"}</p><ProfileForm account={account} accessToken={session.accessToken!} /></section></SiteShell>; }
