'use client';

import { useState, useMemo } from 'react';
import type { Draw, RecommendedSet } from '@/lib/types';
import { calculateAllAnalyses } from '@/lib/analysis';
import {
  generateMultipleSets,
  generateOneSet,
  BALANCED_WEIGHTS,
  RECENT_WINDOW,
} from '@/lib/scoring';
import { COLORS, formatKoreanDate, getNextDrawDate } from '@/lib/ui';

import { AutoSets } from './AutoSets';
import { HotColdPanel } from './HotColdPanel';
import { SemiAuto } from './SemiAuto';
import { RecentDraws } from './RecentDraws';

export function LottoApp({ draws }: { draws: Draw[] }) {
  const [autoSets, setAutoSets] = useState<RecommendedSet[] | null>(null);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);

  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [semiResult, setSemiResult] = useState<RecommendedSet | null>(null);
  const [isSemiGenerating, setIsSemiGenerating] = useState(false);

  const analyses = useMemo(
    () => calculateAllAnalyses(draws, RECENT_WINDOW),
    [draws]
  );

  const hotNumbers = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => i + 1)
        .sort((a, b) => analyses.recentFrequency[b] - analyses.recentFrequency[a])
        .slice(0, 10),
    [analyses]
  );

  const coldNumbers = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => i + 1)
        .sort((a, b) => analyses.gap[b] - analyses.gap[a])
        .slice(0, 10),
    [analyses]
  );

  // 데이터가 없을 때 안내 (hooks 호출 후로 이동)
  if (!draws || draws.length === 0) {
    return <EmptyState />;
  }

  const handleAutoGenerate = () => {
    setIsAutoGenerating(true);
    setTimeout(() => {
      setAutoSets(generateMultipleSets(draws, BALANCED_WEIGHTS, analyses, 5));
      setIsAutoGenerating(false);
    }, 350);
  };

  const toggleNumber = (n: number) => {
    setSemiResult(null);
    setSelectedNumbers((prev) => {
      if (prev.includes(n)) return prev.filter((x) => x !== n);
      if (prev.length >= 6) return prev;
      return [...prev, n].sort((a, b) => a - b);
    });
  };

  const handleSemiGenerate = () => {
    setIsSemiGenerating(true);
    setTimeout(() => {
      const result = generateOneSet(
        draws,
        BALANCED_WEIGHTS,
        analyses,
        Date.now(),
        selectedNumbers
      );
      setSemiResult(result);
      setIsSemiGenerating(false);
    }, 300);
  };

  const handleClearSelection = () => {
    setSelectedNumbers([]);
    setSemiResult(null);
  };

  const latestDraw = draws[draws.length - 1];
  const nextDrawDate = getNextDrawDate(latestDraw.drwNoDate);
  const nextRound = latestDraw.drwNo + 1;

  return (
    <div
      style={{
        backgroundColor: COLORS.bg,
        minHeight: '100vh',
        color: COLORS.text,
      }}
    >
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 48px' }}>
        {/* ────── Header ────── */}
        <div
          style={{
            marginBottom: 28,
            borderBottom: `1px solid ${COLORS.border}`,
            paddingBottom: 20,
          }}
        >
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 38,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            로또{' '}
            <span style={{ fontStyle: 'italic', color: COLORS.accent }}>분석</span>
          </h1>
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <p style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }}>
              다음 추첨 · {formatKoreanDate(nextDrawDate)}
            </p>
            <p
              style={{
                fontSize: 12,
                color: COLORS.textMuted,
                margin: 0,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {nextRound}회차
            </p>
          </div>
        </div>

        {/* ────── 5세트 자동 추천 CTA ────── */}
        <button
          onClick={handleAutoGenerate}
          disabled={isAutoGenerating}
          style={{
            width: '100%',
            padding: '18px',
            backgroundColor: COLORS.accent,
            color: COLORS.card,
            border: 'none',
            borderRadius: 12,
            fontSize: 17,
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: 28,
            fontFamily: 'inherit',
            boxShadow: `0 4px 14px ${COLORS.accent}30`,
            transition: 'opacity 0.15s',
            opacity: isAutoGenerating ? 0.6 : 1,
          }}
        >
          {isAutoGenerating
            ? '계산 중...'
            : autoSets
            ? '다시 추천 받기'
            : '5세트 자동 추천 받기'}
        </button>

        {/* ────── 자동 추천 결과 ────── */}
        {autoSets && <AutoSets sets={autoSets} />}

        {/* ────── Hot 패널 ────── */}
        <HotColdPanel
          title="최근 자주 나온 번호 TOP 10"
          numbers={hotNumbers}
          getLabel={(n) => `${analyses.recentFrequency[n]}회 출현`}
          selectedNumbers={selectedNumbers}
          onToggle={toggleNumber}
          footer={`* 최근 ${RECENT_WINDOW}회차 기준`}
        />

        {/* ────── Cold 패널 ────── */}
        <HotColdPanel
          title="오래 안 나온 번호 TOP 10"
          numbers={coldNumbers}
          getLabel={(n) => `${analyses.gap[n]}회 전`}
          selectedNumbers={selectedNumbers}
          onToggle={toggleNumber}
        />

        {/* ────── 반자동 추천 ────── */}
        <SemiAuto
          selectedNumbers={selectedNumbers}
          result={semiResult}
          isGenerating={isSemiGenerating}
          onGenerate={handleSemiGenerate}
          onClear={handleClearSelection}
        />

        {/* ────── 최근 5회 당첨번호 ────── */}
        <RecentDraws draws={draws} />

        {/* ────── Disclaimer ────── */}
        <p
          style={{
            fontSize: 11,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 1.6,
            marginTop: 24,
          }}
        >
          ※ 통계 분석이며 당첨을 예측하지 않습니다.
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        backgroundColor: COLORS.bg,
        minHeight: '100vh',
        color: COLORS.text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}
    >
      <div style={{ maxWidth: 380, textAlign: 'center' }}>
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 32,
            fontWeight: 300,
            margin: '0 0 16px',
          }}
        >
          데이터 준비 필요
        </h1>
        <p style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>
          <code
            style={{
              backgroundColor: COLORS.card,
              padding: '2px 6px',
              borderRadius: 4,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            npm run fetch-draws
          </code>
          <br />
          를 실행해서 회차 데이터를 받아주세요.
        </p>
      </div>
    </div>
  );
}
