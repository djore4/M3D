import Link from "next/link";
import { getAdminUser } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import LogoutButton from "@/components/admin/LogoutButton";
import CubeMark from "@/components/CubeMark";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();

  // Sem sessão de admin (ex.: página de login) -> renderiza sem a shell.
  // O middleware garante que rotas protegidas redirecionam para o login.
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-60 flex-col border-r border-slate-200 bg-white p-4 sm:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 font-display font-bold text-slate-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
            <CubeMark className="h-5 w-5" />
          </span>
          M3D · Gestão
        </Link>
        <AdminNav />
        <div className="mt-auto border-t border-slate-200 pt-4">
          <p className="mb-2 truncate text-xs text-slate-400">{user.email}</p>
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm text-slate-500 hover:text-brand-600">
              Ver loja
            </Link>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="flex-1">
        {/* Barra superior (mobile) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white p-4 sm:hidden">
          <Link href="/admin" className="font-bold">
            Gestão
          </Link>
          <LogoutButton />
        </div>
        <div className="p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
