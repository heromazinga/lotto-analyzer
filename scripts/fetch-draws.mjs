/**
 * 동행복권 회차 데이터 수집 스크립트
 *
 * 실행: node scripts/fetch-draws.mjs
 * 출력: data/draws.json
 *
 * - 1회차부터 최신 회차까지 순차적으로 가져옴
 * - data/draws.json이 이미 있으면 신규 회차만 incremental 페치
 * - API 한도/예의를 위해 호출 간 80ms throttle (조정 가능)
 */

import fs from 'node:fs/promises';
import path from 'node:path';

const API_BASE =
  'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';
const OUTPUT_PATH = path.resolve('data/draws.json');
const THROTTLE_MS = 80;
const MAX_CONSECUTIVE_FAILS = 2; // 연속 실패 2회 → 최신까지 다 받은 것으로 간주

async function fetchDraw(drwNo) {
  const res = await fetch(`${API_BASE}${drwNo}`, {
    headers: { 'User-Agent': 'lotto-analyzer/1.0' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.returnValue !== 'success') return null;
  return {
    drwNo: data.drwNo,
    drwNoDate: data.drwNoDate, // 'YYYY-MM-DD'
    numbers: [
      data.drwtNo1,
      data.drwtNo2,
      data.drwtNo3,
      data.drwtNo4,
      data.drwtNo5,
      data.drwtNo6,
    ].sort((a, b) => a - b),
    bonus: data.bnusNo,
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function loadExisting() {
  try {
    const raw = await fs.readFile(OUTPUT_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function main() {
  const existing = await loadExisting();
  const startFrom =
    existing.reduce((max, d) => Math.max(max, d.drwNo), 0) + 1;

  console.log(`기존 캐시: ${existing.length}회차`);
  console.log(`${startFrom}회차부터 페치 시작\n`);

  const fresh = [];
  let n = startFrom;
  let consecutiveFails = 0;

  while (consecutiveFails < MAX_CONSECUTIVE_FAILS) {
    process.stdout.write(`\r회차 ${n} ...`);
    try {
      const draw = await fetchDraw(n);
      if (draw === null) {
        consecutiveFails++;
        n++;
        continue;
      }
      fresh.push(draw);
      consecutiveFails = 0;
      n++;
    } catch (err) {
      console.error(`\n${n}회차 에러: ${err.message}`);
      consecutiveFails++;
      n++;
    }
    await sleep(THROTTLE_MS);
  }

  console.log(`\n\n신규 수집: ${fresh.length}회차`);

  const all = [...existing, ...fresh].sort((a, b) => a.drwNo - b.drwNo);

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(all));

  console.log(`총 ${all.length}회차 → ${OUTPUT_PATH}`);
  if (all.length > 0) {
    const latest = all[all.length - 1];
    console.log(`최신: ${latest.drwNo}회 (${latest.drwNoDate})`);
    console.log(`당첨번호: ${latest.numbers.join(' ')} + ${latest.bonus}`);
  }
}

main().catch((err) => {
  console.error('\n실패:', err);
  process.exit(1);
});
