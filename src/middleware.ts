import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } from "./lib/supabase/config";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Blindagem: qualquer falha na leitura da sessão nunca pode deitar o site
  // abaixo (evita o 500 MIDDLEWARE_INVOCATION_FAILED). Em caso de erro, deixa
  // a rota seguir; as páginas de /admin voltam a ser protegidas no servidor.
  try {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;
    const isAdminArea = path.startsWith("/admin");
    const isAdminLogin = path === "/admin/login";
    const isAdmin = !!user && (!ADMIN_EMAIL || user.email?.toLowerCase().trim() === ADMIN_EMAIL);

    // Protege o backoffice: sem sessão de admin -> redireciona para login
    if (isAdminArea && !isAdminLogin && !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    // Já autenticado a tentar aceder ao login -> vai para o dashboard
    if (isAdminLogin && isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    console.error("middleware error:", err);
  }

  return response;
}

export const config = {
  matcher: [
    // Corre em todas as rotas exceto ficheiros estáticos e imagens
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
