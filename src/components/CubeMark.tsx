/** Ícone isométrico de cubo — assinatura visual da M3D (3D). */
export default function CubeMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 2.5 21 7.5V16.5L12 21.5 3 16.5V7.5L12 2.5Z" className="stroke-current" strokeWidth="1.4" strokeLinejoin="round" opacity="0.35" />
      <path d="M12 2.5 21 7.5 12 12.5 3 7.5 12 2.5Z" fill="currentColor" opacity="0.9" />
      <path d="M3 7.5 12 12.5V21.5L3 16.5V7.5Z" fill="currentColor" opacity="0.5" />
      <path d="M21 7.5 12 12.5V21.5L21 16.5V7.5Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
