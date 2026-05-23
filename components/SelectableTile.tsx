'use client';

import { Ball } from './Ball';
import { COLORS } from '@/lib/ui';

export function SelectableTile({
  n,
  label,
  selected,
  disabled,
  onToggle,
}: {
  n: number;
  label: string;
  selected: boolean;
  disabled: boolean;
  onToggle: (n: number) => void;
}) {
  return (
    <button
      onClick={() => onToggle(n)}
      disabled={disabled}
      style={{
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        transition: 'opacity 0.15s',
      }}
    >
      <div
        style={{
          padding: 3,
          borderRadius: '50%',
          border: selected ? `2px solid ${COLORS.ring}` : '2px solid transparent',
          backgroundColor: selected ? COLORS.ring : 'transparent',
          transition: 'all 0.15s',
          transform: selected ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        <Ball n={n} size="sm" />
      </div>
      <span
        style={{
          fontSize: 10,
          color: COLORS.textMuted,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </span>
    </button>
  );
}
