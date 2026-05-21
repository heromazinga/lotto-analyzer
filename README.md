# Lotto Analyzer · Next.js 구조 가이드

## 1. 프로젝트 생성

```bash
npx create-next-app@latest lotto-analyzer --typescript --tailwind --app --no-src-dir
cd lotto-analyzer
```

## 2. 파일 배치

이 starter의 파일을 이렇게 옮긴다.

```
lotto-analyzer/
├── scripts/
│   └── fetch-draws.mjs       ← 이 파일 그대로
├── lib/
│   ├── types.ts              ← 이 파일 그대로
│   ├── analysis.ts           ← lotto-analyzer.jsx에서 추출 (아래 참고)
│   └── scoring.ts            ← lotto-analyzer.jsx에서 추출 (아래 참고)
├── data/
│   └── draws.json            ← 스크립트가 자동 생성
└── app/
    └── page.tsx              ← lotto-analyzer.jsx의 UI를 옮김
```

## 3. 데이터 페치

처음 한 번:

```bash
node scripts/fetch-draws.mjs
```

1226회차 기준 약 100초 소요. `data/draws.json` 생성됨. 매주 토요일 추첨 이후 다시 실행하면 신규 회차만 incremental 추가.

`package.json`에 스크립트 등록:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "fetch-draws": "node scripts/fetch-draws.mjs"
  }
}
```

## 4. 프로토타입의 로직 이식

`lotto-analyzer.jsx` 안에 있는 함수들을 잘라서 `lib/`로 옮김:

**lib/analysis.ts** 에 들어갈 것:
- `calculateFrequency`
- `calculateGap`
- `calculateCoOccurrence`

타입만 살짝 입혀주면 됨:

```typescript
import type { Draw } from './types';

export function calculateFrequency(draws: Draw[]): number[] {
  const freq = new Array(46).fill(0);
  for (const d of draws) for (const n of d.numbers) freq[n]++;
  return freq;
}
// ... 나머지도 동일 패턴
```

**lib/scoring.ts** 에 들어갈 것:
- `computeScores`
- `passesFilter`
- `pickWeighted`
- `generateOneSet`
- `buildSet`
- `generateMultipleSets`
- `BALANCED_WEIGHTS` 상수
- `RECENT_WINDOW` 상수

## 5. app/page.tsx 변환

프로토타입은 mock 데이터를 `useMemo`로 생성했지만, 실 앱에서는 서버 컴포넌트에서 JSON을 import한 뒤 클라이언트 컴포넌트로 넘김:

```typescript
// app/page.tsx (서버 컴포넌트)
import draws from '@/data/draws.json';
import LottoApp from '@/components/LottoApp';
import type { Draw } from '@/lib/types';

export default function Page() {
  return <LottoApp draws={draws as Draw[]} />;
}
```

```typescript
// components/LottoApp.tsx (클라이언트 컴포넌트)
'use client';
import { useState, useMemo } from 'react';
import type { Draw } from '@/lib/types';
import { calculateFrequency, calculateGap, calculateCoOccurrence } from '@/lib/analysis';
import { generateMultipleSets, generateOneSet, BALANCED_WEIGHTS } from '@/lib/scoring';

export default function LottoApp({ draws }: { draws: Draw[] }) {
  // ... 프로토타입의 LottoApp 로직 그대로
  // generateMockDraws 호출만 제거, props로 받은 draws 사용
}
```

폴더 트리에서 `components/`를 만들어 `Ball.tsx`, `SelectableTile.tsx`, `AutoSets.tsx`, `HotColdPanel.tsx`, `SemiAuto.tsx`, `RecentDraws.tsx`로 분리하면 유지보수 편함. 한 번에 다 쪼갤 필요는 없고, 일단 `LottoApp.tsx` 하나로 시작해도 됨.

## 6. 배포

`data/draws.json`까지 커밋 → GitHub push → Vercel 자동 배포.

신규 회차 갱신 흐름:
1. 토요일 저녁 이후 `npm run fetch-draws`
2. `git add data/draws.json && git commit -m "data: 1227회차 추가" && git push`
3. Vercel이 자동 재배포

## 7. (선택) 자동화

GitHub Actions로 매주 일요일 새벽에 자동 페치 + 커밋:

```yaml
# .github/workflows/weekly-fetch.yml
name: Weekly Draw Fetch
on:
  schedule:
    - cron: '0 18 * * 6'  # 매주 토요일 KST 새벽 3시
  workflow_dispatch:
jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: node scripts/fetch-draws.mjs
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'data: weekly draw update'
```

이러면 부모님 폰에는 매주 자동으로 최신 회차가 반영됨.
