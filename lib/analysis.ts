import type { Draw, Analyses } from './types';

/** 번호별 전체 출현 횟수 (인덱스 1~45 사용) */
export function calculateFrequency(draws: Draw[]): number[] {
  const freq = new Array(46).fill(0);
  for (const d of draws) for (const n of d.numbers) freq[n]++;
  return freq;
}

/** 번호별 미출현 간격 (마지막 출현 이후 경과 회차) */
export function calculateGap(draws: Draw[]): number[] {
  const gap = new Array(46).fill(draws.length);
  for (let i = draws.length - 1; i >= 0; i--) {
    for (const n of draws[i].numbers) {
      if (gap[n] === draws.length) gap[n] = draws.length - 1 - i;
    }
  }
  return gap;
}

/** 동반 출현 행렬 (co[a][b] = a와 b가 같은 회차에 같이 나온 횟수) */
export function calculateCoOccurrence(draws: Draw[]): number[][] {
  const co: number[][] = Array.from({ length: 46 }, () => new Array(46).fill(0));
  for (const d of draws) {
    for (let i = 0; i < 6; i++) {
      for (let j = i + 1; j < 6; j++) {
        co[d.numbers[i]][d.numbers[j]]++;
        co[d.numbers[j]][d.numbers[i]]++;
      }
    }
  }
  return co;
}

/** 모든 분석 지표를 한 번에 계산 (memo 친화적) */
export function calculateAllAnalyses(draws: Draw[], recentWindow: number): Analyses {
  const recentDraws = draws.slice(-recentWindow);
  return {
    frequency: calculateFrequency(draws),
    gap: calculateGap(draws),
    coOccurrence: calculateCoOccurrence(draws),
    recentFrequency: calculateFrequency(recentDraws),
  };
}
