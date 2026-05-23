/**
 * 데이터 모델
 */

/** 회차별 당첨 결과 (동행복권 API 페치 결과) */
export type Draw = {
  drwNo: number;
  drwNoDate: string; // 'YYYY-MM-DD'
  numbers: number[]; // 길이 6, 오름차순 정렬
  bonus: number;
};

/** 번호별 분석 지표 묶음 (1~45번 인덱싱, index 0은 미사용) */
export type Analyses = {
  /** 전체 출현 횟수 */
  frequency: number[];
  /** 최신 회차로부터 마지막 출현까지 경과 회차 */
  gap: number[];
  /** 동반 출현 행렬 (co[a][b] = a와 b가 같은 회차에 나온 횟수) */
  coOccurrence: number[][];
  /** 최근 N회차 내 출현 횟수 ("hot" 계산용) */
  recentFrequency: number[];
};

/** 스코어링 가중치 */
export type Weights = {
  freq: number;
  gap: number;
  coOcc: number;
};

/** 추천 결과 한 세트 */
export type RecommendedSet = {
  combination: number[]; // 길이 6, 오름차순
  stats: {
    sum: number;
    oddCount: number;
    evenCount: number;
  };
};
