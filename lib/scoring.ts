import type { Draw, Analyses, Weights, RecommendedSet } from './types';

// ═══════════════════════════════════════════════════════════
// 상수
// ═══════════════════════════════════════════════════════════
export const BALANCED_WEIGHTS: Weights = { freq: 1, gap: 1, coOcc: 1 };
export const RECENT_WINDOW = 30; // "최근 자주 나온" 정의 (회차)

// ═══════════════════════════════════════════════════════════
// PRNG (Mulberry32 — 시드 가능한 빠른 난수)
// ═══════════════════════════════════════════════════════════
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ═══════════════════════════════════════════════════════════
// 스코어링: w₁·freqScore + w₂·gapScore  (coOcc는 생성 단계에서 가산)
// ═══════════════════════════════════════════════════════════
export function computeScores(
  draws: Draw[],
  weights: Weights,
  analyses: Analyses
): number[] {
  const { frequency, gap } = analyses;
  const expected = (6 / 45) * draws.length;
  const expectedGap = 45 / 6;
  const scores = new Array(46).fill(0);
  for (let n = 1; n <= 45; n++) {
    const fs = expected > 0 ? frequency[n] / expected : 1;
    const gs = gap[n] / expectedGap;
    scores[n] = weights.freq * fs + weights.gap * gs;
  }
  return scores;
}

// ═══════════════════════════════════════════════════════════
// 조합 필터 (비현실적 조합 제거)
// ═══════════════════════════════════════════════════════════
export function passesFilter(combo: number[]): boolean {
  const sum = combo.reduce((a, b) => a + b, 0);
  if (sum < 100 || sum > 175) return false;

  const odds = combo.filter((n) => n % 2 === 1).length;
  if (odds < 2 || odds > 4) return false;

  let consec = 0;
  for (let i = 0; i < 5; i++) if (combo[i + 1] - combo[i] === 1) consec++;
  if (consec > 1) return false;

  const lastDigit: Record<number, number> = {};
  for (const n of combo) {
    const d = n % 10;
    lastDigit[d] = (lastDigit[d] || 0) + 1;
    if (lastDigit[d] > 2) return false;
  }
  return true;
}

// ═══════════════════════════════════════════════════════════
// 가중 랜덤 선택
// ═══════════════════════════════════════════════════════════
function pickWeighted(pool: number[], scores: number[], rand: () => number): number {
  const eps = 0.01;
  const total = pool.reduce((s, n) => s + Math.max(eps, scores[n]), 0);
  let r = rand() * total;
  for (const n of pool) {
    r -= Math.max(eps, scores[n]);
    if (r <= 0) return n;
  }
  return pool[pool.length - 1];
}

// ═══════════════════════════════════════════════════════════
// 결과 빌드
// ═══════════════════════════════════════════════════════════
function buildSet(combo: number[]): RecommendedSet {
  const sum = combo.reduce((a, b) => a + b, 0);
  const oddCount = combo.filter((n) => n % 2 === 1).length;
  return {
    combination: combo,
    stats: { sum, oddCount, evenCount: 6 - oddCount },
  };
}

// ═══════════════════════════════════════════════════════════
// 1세트 생성 (반자동 지원: fixed 번호는 고정)
// ═══════════════════════════════════════════════════════════
export function generateOneSet(
  draws: Draw[],
  weights: Weights,
  analyses: Analyses,
  seed: number,
  fixed: number[] = []
): RecommendedSet {
  const rand = mulberry32(seed);
  const baseScores = computeScores(draws, weights, analyses);
  const co = analyses.coOccurrence;

  // 이미 6개 고정이면 그대로 반환
  if (fixed.length === 6) {
    return buildSet([...fixed].sort((a, b) => a - b));
  }

  const ranked = Array.from({ length: 45 }, (_, i) => i + 1)
    .filter((n) => !fixed.includes(n))
    .sort((a, b) => baseScores[b] - baseScores[a]);
  const pool = ranked.slice(0, 25);

  for (let attempt = 0; attempt < 500; attempt++) {
    const selected = [...fixed];
    while (selected.length < 6) {
      const remaining = pool.filter((n) => !selected.includes(n));
      if (remaining.length === 0) break;

      // 동반출현 보너스 적용
      const adjusted = [...baseScores];
      for (const n of remaining) {
        let cs = 0;
        for (const s of selected) cs += co[n][s];
        adjusted[n] =
          baseScores[n] +
          (weights.coOcc * (cs / Math.max(1, selected.length))) / 5;
      }
      selected.push(pickWeighted(remaining, adjusted, rand));
    }
    const combo = [...selected].sort((a, b) => a - b);
    if (combo.length === 6 && passesFilter(combo)) {
      return buildSet(combo);
    }
  }

  // Fallback: 필터 통과 못하면 고정 + 스코어 상위로 채움
  const fill = ranked.slice(0, 6 - fixed.length);
  return buildSet([...fixed, ...fill].sort((a, b) => a - b));
}

// ═══════════════════════════════════════════════════════════
// 여러 세트 생성 (중복 제거)
// ═══════════════════════════════════════════════════════════
export function generateMultipleSets(
  draws: Draw[],
  weights: Weights,
  analyses: Analyses,
  count = 5
): RecommendedSet[] {
  const baseSeed = Date.now();
  const sets: RecommendedSet[] = [];
  const seen = new Set<string>();
  let attempts = 0;

  while (sets.length < count && attempts < count * 30) {
    const result = generateOneSet(
      draws,
      weights,
      analyses,
      baseSeed + attempts * 9973
    );
    const key = result.combination.join(',');
    if (!seen.has(key)) {
      seen.add(key);
      sets.push(result);
    }
    attempts++;
  }
  return sets;
}
