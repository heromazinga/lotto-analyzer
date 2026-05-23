'use client';

import { SelectableTile } from './SelectableTile';
import { SectionLabel } from './SectionLabel';
import { COLORS } from '@/lib/ui';

export function HotColdPanel({
  title,
  numbers,
  getLabel,
  selectedNumbers,
  onToggle,
  footer,
}: {
  title: string;
  numbers: number[];
  getLabel: (n: number) => string;
  selectedNumbers: number[];
  onToggle: (n: number) => void;
  footer?: string;
}) {
  return (
    <div style={{ marginBottom: footer ? 24 : 28 }}>
      <SectionLabel>{title}</SectionLabel>
      <div
        style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 18,
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 14,
        }}
      >
        {numbers.map((n) => (
          <SelectableTile
            key={n}
            n={n}
            label={getLabel(n)}
            selected={selectedNumbers.includes(n)}
            disabled={!selectedNumbers.includes(n) && selectedNumbers.length >= 6}
            onToggle={onToggle}
          />
        ))}
      </div>
      {footer && (
        <p
          style={{
            fontSize: 11,
            color: COLORS.textMuted,
            marginTop: 6,
            marginBottom: 0,
            textAlign: 'right',
          }}
        >
          {footer}
        </p>
      )}
    </div>
  );
}
