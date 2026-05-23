import drawsData from '@/data/draws.json';
import type { Draw } from '@/lib/types';
import { LottoApp } from '@/components/LottoApp';

// 매주 새로운 데이터가 들어오면 빌드 타임에 반영
export const dynamic = 'force-static';

export default function Page() {
  const draws = drawsData as Draw[];
  return <LottoApp draws={draws} />;
}
