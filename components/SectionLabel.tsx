import { COLORS } from '@/lib/ui';

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.12em',
        color: COLORS.textMuted,
        margin: '0 0 12px',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </h2>
  );
}
