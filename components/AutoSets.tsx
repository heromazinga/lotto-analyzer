import type { RecommendedSet } from '@/lib/types';
import { Ball } from './Ball';
import { SectionLabel } from './SectionLabel';
import { COLORS } from '@/lib/ui';

export function AutoSets({ sets }: { sets: RecommendedSet[] }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <SectionLabel>이번 주 추천 5세트</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sets.map((set, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12,
              padding: '14px 14px 16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                세트 {idx + 1}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: COLORS.textMuted,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                합 {set.stats.sum} · 홀짝 {set.stats.oddCount}:{set.stats.evenCount}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              {set.combination.map((n) => (
                <Ball key={n} n={n} size="md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
