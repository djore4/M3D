export type Lang = "pt" | "en";

export const LANGS: Lang[] = ["pt", "en"];
export const DEFAULT_LANG: Lang = "pt";

export const dict = {
  pt: {
    "nav.home": "Início",
    "nav.shop": "Loja",
    "nav.cart": "Carrinho",
    "nav.admin": "Gestão",
    "home.hero.title": "Merchandising impresso em 3D",
    "home.hero.subtitle": "Peças únicas, feitas à medida e impressas em 3D.",
    "home.hero.cta": "Ver a loja",
    "home.featured": "Em destaque",
    "home.promos": "Promoções",
    "shop.title": "Loja",
    "shop.empty": "Ainda não há produtos disponíveis.",
    "product.addToCart": "Adicionar ao carrinho",
    "product.outOfStock": "Esgotado",
    "product.inStock": "em stock",
    "product.promo": "Promoção",
    "product.featured": "Destaque",
    "product.back": "Voltar à loja",
    "cart.title": "Carrinho",
    "cart.empty": "O teu carrinho está vazio.",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Portes",
    "cart.total": "Total",
    "cart.checkout": "Finalizar compra",
    "cart.remove": "Remover",
    "cart.continue": "Continuar a comprar",
    "cart.qty": "Qtd.",
    "checkout.title": "Finalizar compra",
    "checkout.contact": "Contacto",
    "checkout.shipping": "Envio",
    "checkout.email": "Email",
    "checkout.name": "Nome completo",
    "checkout.phone": "Telemóvel",
    "checkout.address": "Morada",
    "checkout.postal": "Código postal",
    "checkout.city": "Localidade",
    "checkout.shippingMethod": "Método de envio",
    "checkout.pay": "Pagar",
    "checkout.free": "Grátis",
    "success.title": "Obrigado pela tua compra!",
    "success.subtitle": "Recebemos a tua encomenda e enviámos a confirmação por email.",
    "success.order": "Encomenda",
    "success.backHome": "Voltar ao início",
    "footer.rights": "Todos os direitos reservados.",
  },
  en: {
    "nav.home": "Home",
    "nav.shop": "Shop",
    "nav.cart": "Cart",
    "nav.admin": "Admin",
    "home.hero.title": "3D printed merchandise",
    "home.hero.subtitle": "Unique, made-to-order 3D printed pieces.",
    "home.hero.cta": "Browse the shop",
    "home.featured": "Featured",
    "home.promos": "On sale",
    "shop.title": "Shop",
    "shop.empty": "No products available yet.",
    "product.addToCart": "Add to cart",
    "product.outOfStock": "Out of stock",
    "product.inStock": "in stock",
    "product.promo": "Sale",
    "product.featured": "Featured",
    "product.back": "Back to shop",
    "cart.title": "Cart",
    "cart.empty": "Your cart is empty.",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.remove": "Remove",
    "cart.continue": "Continue shopping",
    "cart.qty": "Qty",
    "checkout.title": "Checkout",
    "checkout.contact": "Contact",
    "checkout.shipping": "Shipping",
    "checkout.email": "Email",
    "checkout.name": "Full name",
    "checkout.phone": "Phone",
    "checkout.address": "Address",
    "checkout.postal": "Postal code",
    "checkout.city": "City",
    "checkout.shippingMethod": "Shipping method",
    "checkout.pay": "Pay",
    "checkout.free": "Free",
    "success.title": "Thank you for your order!",
    "success.subtitle": "We received your order and sent a confirmation by email.",
    "success.order": "Order",
    "success.backHome": "Back to home",
    "footer.rights": "All rights reserved.",
  },
} as const;

export type TranslationKey = keyof (typeof dict)["pt"];

export function t(lang: Lang, key: TranslationKey): string {
  return dict[lang][key] ?? dict[DEFAULT_LANG][key] ?? key;
}

/** Escolhe o campo PT/EN de um produto, com fallback para PT. */
export function pick(lang: Lang, pt: string, en: string): string {
  if (lang === "en") return en || pt;
  return pt || en;
}
