# 로또 분석 (Lotto Analyzer)

통계 기반 로또 번호 추천 웹앱. Next.js + Vercel.

## 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 동행복권 회차 데이터 받기 (최초 1회, 약 100초)
npm run fetch-draws

# 3. 개발 서버
npm run dev
```

브라우저에서 http://localhost:3000 확인.

## 폴더 구조

```
lotto-analyzer/
├── app/                   # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx          # 서버 컴포넌트, draws.json 로드
│   └── globals.css
├── components/            # UI 컴포넌트
│   ├── LottoApp.tsx      # 메인 클라이언트 컴포넌트
│   ├── Ball.tsx          # 로또공 + 빈 슬롯
│   ├── SelectableTile.tsx
│   ├── SectionLabel.tsx
│   ├── AutoSets.tsx      # 5세트 자동 추천 결과
│   ├── HotColdPanel.tsx  # Hot/Cold 번호 패널
│   ├── SemiAuto.tsx      # 반자동 추천 박스
│   └── RecentDraws.tsx   # 최근 5회 당첨번호
├── lib/                   # 순수 로직
│   ├── types.ts          # 데이터 모델
│   ├── analysis.ts       # 빈도/간격/동반출현 분석
│   ├── scoring.ts        # 스코어링/필터링/추천 생성
│   └── ui.ts             # 색상 토큰, 날짜 포맷터
├── scripts/
│   └── fetch-draws.mjs   # 동행복권 API 페치
├── data/
│   └── draws.json        # 회차 데이터 (페치 결과)
└── package.json
```

## 매주 데이터 갱신

토요일 추첨 이후:

```bash
npm run fetch-draws   # 신규 회차만 incremental 페치
git add data/draws.json
git commit -m "data: NNNN회차 추가"
git push              # Vercel 자동 재배포
```

## 자동화 (선택)

`.github/workflows/weekly-fetch.yml`로 매주 토요일 새벽 자동 페치 가능. 필요하면 알려줘.

## 분석 로직 요약

- **빈도 점수**: `(번호별 출현 횟수 / 전체 회차수) / (6/45)` — 1.0 초과면 기대치보다 자주
- **간격 점수**: `현재 미출현 회차수 / 7.5` — 오래 안 나올수록 큼
- **동반 출현**: 1차 후보 선정 후, 이미 뽑힌 번호와 같이 나오는 빈도로 가산
- **필터**: 합계 100–175 / 홀짝 2:4–4:2 / 연속수 1쌍 이하 / 끝자리 동일 최대 2개

추천 흐름: 스코어 상위 25개 풀 → 가중 샘플링 6개 → 필터 통과 검사 → 통과 못하면 최대 500회 재시도.

## 주의

통계 분석일 뿐 실제 당첨을 예측할 수 없습니다. 로또는 매 회차 독립시행입니다.
