/** Ícones de linha monocromáticos para os placeholders de produto. */
export type IconName = "vase" | "phone" | "die" | "key" | "cube";

const paths: Record<IconName, React.ReactNode> = {
  vase: (
    <>
      <path d="M8 3.5h8l-1.1 3.1A7 7 0 0 1 16.5 20.5h-9A7 7 0 0 1 9.1 6.6L8 3.5Z" />
      <path d="M9.2 12.5c1.8 1 3.8 1 5.6 0" />
    </>
  ),
  phone: (
    <>
      <rect x="8" y="3.5" width="8" height="13" rx="1.6" />
      <path d="M6 20.5h12M9.5 20.5l1.3-3.2M14.5 20.5l-1.3-3.2" />
    </>
  ),
  die: (
    <>
      <path d="M12 2.5l8.5 5v9L12 21.5 3.5 16.5v-9L12 2.5Z" />
      <path d="M12 2.5v6.6M3.5 7.5 12 9.1 20.5 7.5M12 9.1l-5 7.4M12 9.1l5 7.4M7 16.5h10" />
    </>
  ),
  key: (
    <>
      <circle cx="8.5" cy="8.5" r="3.6" />
      <path d="M11 11 20 20M16.6 16.6l2.4-2.4M14.2 14.2l1.9-1.9" />
    </>
  ),
  cube: (
    <>
      <path d="M12 2.5 21 7.5V16.5L12 21.5 3 16.5V7.5L12 2.5Z" />
      <path d="M3 7.5 12 12.5 21 7.5M12 12.5V21.5" />
    </>
  ),
};

/** Escolhe um ícone a partir do slug/nome do produto. */
export function iconForSlug(slug: string): IconName {
  const s = slug.toLowerCase();
  if (/(vaso|vase)/.test(s)) return "vase";
  if (/(suporte|stand|telemo|phone)/.test(s)) return "phone";
  if (/(drag|mini|d20|dado|die)/.test(s)) return "die";
  if (/(chaveiro|key|porta)/.test(s)) return "key";
  return "cube";
}

export default function LineIcon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
