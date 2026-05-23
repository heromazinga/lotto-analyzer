'use client';

import type { RecommendedSet } from '@/lib/types';
import { Ball, EmptySlot } from './Ball';
import { COLORS } from '@/lib/ui';

export function SemiAuto({
  selectedNumbers,
  result,
  isGenerating,
  onGenerate,
  onClear,
}: {
  selectedNumbers: number[];
  result: RecommendedSet | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onClear: () => void;
}) {
  return (
    <div
      style={{
        marginBottom: 28,
        backgroundColor: COLORS.card,
        border: `2px solid ${COLORS.accent}25`,
        borderRadius: 14,
        padding: '18px 16px 20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <h2
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: 0,
            color: COLORS.text,
          }}
        >
          반자동 추천
        </h2>
        {selectedNumbers.length > 0 && !result && (
          <button
            onClick={onClear}
            style={{
              background: 'transparent',
              border: 'none',
              color: COLORS.textMuted,
              fontSize: 12,
              cursor: 'pointer',
              padding: 4,
              fontFamily: 'inherit',
            }}
          >
            선택 초기화
          </button>
        )}
      </div>

      {!result ? (
        <>
          <p
            style={{
              fontSize: 13,
              color: COLORS.textMuted,
              margin: '0 0 14px',
              lineHeight: 1.5,
            }}
          >
            위 패널에서 마음에 드는 번호를 선택하시면
            <br />
            나머지 자리를 추천으로 채워드려요.
          </p>
          <div
            style={{
              display: 'flex',
              gap: 6,
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) =>
              selectedNumbers[i] !== undefined ? (
                <Ball key={i} n={selectedNumbers[i]} size="md" />
              ) : (
                <EmptySlot key={i} size="md" />
              )
            )}
          </div>
          <p
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              margin: '0 0 14px',
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            선택 {selectedNumbers.length}개 · 추천으로 채울 자리{' '}
            {6 - selectedNumbers.length}개
          </p>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: COLORS.text,
              color: COLORS.card,
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              opacity: isGenerating ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {isGenerating
              ? '계산 중...'
              : selectedNumbers.length === 6
              ? '6개 확인하기'
              : selectedNumbers.length === 0
              ? '6개 모두 추천 받기'
              : `나머지 ${6 - selectedNumbers.length}자리 추천 받기`}
          </button>
        </>
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              gap: 6,
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            {result.combination.map((n) => (
              <Ball key={n} n={n} size="md" />
            ))}
          </div>
          <p
            style={{
              fontSize: 12,
              color: COLORS.textMuted,
              margin: '0 0 14px',
              textAlign: 'center',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            합 {result.stats.sum} · 홀짝 {result.stats.oddCount}:{result.stats.evenCount}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onGenerate}
              disabled={isGenerating || selectedNumbers.length === 6}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: COLORS.text,
                color: COLORS.card,
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                cursor: selectedNumbers.length === 6 ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: selectedNumbers.length === 6 ? 0.4 : 1,
              }}
            >
              다시 추천
            </button>
            <button
              onClick={onClear}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: 'transparent',
                color: COLORS.text,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              초기화
            </button>
          </div>
        </>
      )}
    </div>
  );
}
