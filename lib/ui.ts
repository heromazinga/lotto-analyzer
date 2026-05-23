/**
 * UI 공통 유틸 & 색상 토큰
 */

export const COLORS = {
  bg: '#f8f3e8',
  card: '#ffffff',
  border: '#e8dfc8',
  text: '#1f1b15',
  textMuted: '#857c70',
  accent: '#9a2942',
  ring: '#2a2520',
} as const;

/** 동행복권 공식 번호별 색상 */
export function ballColor(n: number): string {
  if (n <= 10) return '#fbc400';
  if (n <= 20) return '#69c8f2';
  if (n <= 30) return '#ff7272';
  if (n <= 40) return '#aaaaaa';
  return '#b0d840';
}

/** 'YYYY-MM-DD' → 'M월 D일 (요일)' */
export function formatKoreanDate(dateStr: string): string {
  const d = new Date(dateStr);
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
}

/** 다음 추첨일 = 최신 추첨일 + 7일 */
export function getNextDrawDate(latestDrawDate: string): string {
  const d = new Date(latestDrawDate);
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}
