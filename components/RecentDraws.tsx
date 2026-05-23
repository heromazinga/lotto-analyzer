import type { Draw } from '@/lib/types';
import { Ball } from './Ball';
import { SectionLabel } from './SectionLabel';
import { COLORS, formatKoreanDate } from '@/lib/ui';

export function RecentDraws({ draws }: { draws: Draw[] }) {
  const recent = draws.slice(-5).reverse();

  return (
    <div style={{ marginBottom: 24 }}>
      <SectionLabel>최근 5회 당첨번호</SectionLabel>
      <div
        style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {recent.map((d, idx) => (
          <div
            key={d.drwNo}
            style={{
              padding: '14px 16px',
              borderBottom: idx < recent.length - 1 ? `1px solid ${COLORS.border}` : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 8,
                fontSize: 11,
                color: COLORS.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span>{d.drwNo}회</span>
              <span>{formatKoreanDate(d.drwNoDate)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                gap: 5,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {d.numbers.map((n) => (
                <Ball key={n} n={n} size="sm" />
              ))}
              <span style={{ color: COLORS.textMuted, margin: '0 4px', fontSize: 14 }}>+</span>
              <Ball n={d.bonus} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
