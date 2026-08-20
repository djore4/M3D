# M3D — Loja de Merchandising 3D

Loja online completa para venda de merchandising impresso em 3D, com backoffice de
gestão, carrinho, checkout e pagamentos.

**Stack:** Next.js 14 (App Router) · Supabase (base de dados, auth, storage) · Stripe · Tailwind CSS · TypeScript.

---

## Funcionalidades

### Loja (público)
- Página inicial com produtos **em destaque** e **em promoção**
- Catálogo (`/loja`) e página de produto com galeria de fotos
- Interface **bilingue PT/EN** (seletor no topo) · preços em **Euro**
- **Carrinho** persistente (guardado no browser)
- **Checkout como convidado** (sem obrigar a criar conta)
- **Envio com portes** (com opção de portes grátis acima de um valor)
- **Pagamento com Stripe** (cartão, Apple/Google Pay, etc.)

### Gestão (`/admin`, protegido por login)
- **Login** de administrador (Supabase Auth)
- **Criar / editar / apagar produtos**
- **Upload direto de fotos** (Supabase Storage) + campo para o link de referência do Google Fotos
- Definir **preço**, **preço promocional**, **stock**
- Marcar produtos como **destaque** ou **promoção**
- **Dados de vendas**: receita, nº de encomendas, ticket médio, pendentes
- **Gestão de encomendas**: lista, detalhe e alteração de estado (pendente → pago → enviado)

---

## Configuração

### 1. Dependências
```bash
npm install
```

### 2. Supabase
1. Cria um projeto em [supabase.com](https://supabase.com).
2. No **SQL Editor**, corre o conteúdo de `supabase/migrations/0001_init.sql`.
   (Opcional: corre também `supabase/seed.sql` para dados de exemplo.)
3. Em **Storage**, cria um bucket **público** com o nome `product-images`.
4. Cria o utilizador administrador em **Authentication → Users → Add user**
   (usa o mesmo email que vais pôr em `ADMIN_EMAIL`).
5. Copia as chaves de **Project Settings → API**.

### 3. Stripe
1. Cria uma conta em [stripe.com](https://stripe.com) e copia a **Secret key** (`sk_test_...`).
2. Cria um **webhook** apontando para `https://<o-teu-dominio>/api/stripe/webhook`,
   a ouvir o evento `checkout.session.completed`, e copia o **Signing secret** (`whsec_...`).
   - Em local, usa o [Stripe CLI](https://stripe.com/docs/stripe-cli):
     `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### 4. Variáveis de ambiente
Copia `.env.example` para `.env.local` e preenche os valores.

### 5. Arrancar
```bash
npm run dev        # http://localhost:3000
```
- Loja: `/`
- Gestão: `/admin` (redireciona para `/admin/login`)

---

## Notas de segurança
- Os **preços são sempre revalidados no servidor** no checkout — o cliente nunca define o preço.
- A `SUPABASE_SERVICE_ROLE_KEY` só é usada no servidor (criação de encomendas, webhook, uploads).
- O acesso ao `/admin` é restrito ao email definido em `ADMIN_EMAIL` (verificado no middleware e nas server actions).
- As tabelas têm **Row Level Security**: catálogo é público para leitura; encomendas só o admin lê.

## Deploy (publicar online a partir do GitHub)

O código vive no GitHub; a **Vercel** executa-o e liga-o ao Supabase, dando um link público.
Cada `git push` para a branch principal volta a publicar automaticamente.

### Passos (uma só vez)
1. Entra em **[vercel.com](https://vercel.com)** com o botão **"Continue with GitHub"**.
2. **Add New… → Project** e importa o repositório **`djore4/M3D`**.
3. Em **Environment Variables**, adiciona (ver tabela abaixo) e clica **Deploy**.
4. No fim recebes um link do tipo `https://m3d.vercel.app` — é o teu site, acessível em qualquer lugar.

### Variáveis de ambiente (Settings → Environment Variables)
| Variável | Necessária para | Onde obter |
|----------|-----------------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Tudo | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tudo | Supabase → Settings → API |
| `ADMIN_EMAIL` | Login da gestão | O teu email |
| `NEXT_PUBLIC_SITE_URL` | Redirects do pagamento | O URL da Vercel (ex.: `https://m3d.vercel.app`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Checkout, uploads de fotos | Supabase → Settings → API (chave secreta) |
| `STRIPE_SECRET_KEY` | Pagamentos | Stripe → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Confirmar pagamentos | Stripe → Developers → Webhooks |

> A montra e o login funcionam logo só com as 3 primeiras + `NEXT_PUBLIC_SITE_URL`.
> As chaves do Stripe e a `SERVICE_ROLE` podem ser adicionadas depois, para ativar os pagamentos.

### Passos extra no Supabase (uma vez)
- **Storage → New bucket** público chamado `product-images` (para os uploads de fotos).
- **Authentication → Users** já tem o admin criado.

### Stripe (quando quiseres ativar pagamentos)
- Cria o webhook em `https://<o-teu-dominio>/api/stripe/webhook` a ouvir `checkout.session.completed`.
- Depois de definir/alterar variáveis na Vercel, faz **Redeploy** para aplicarem.

## Próximos passos possíveis
- Emails de confirmação de encomenda (ex.: Resend)
- Cálculo de portes por peso/zona
- Variantes de produto (cor/tamanho)
- Cupões de desconto
