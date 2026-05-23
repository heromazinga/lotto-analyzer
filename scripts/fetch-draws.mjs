import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_URL = 'https://smok95.github.io/lotto/results/all.json';
const OUTPUT_PATH = path.resolve('public/draws.json');

function transform(raw) {
  return {
    drwNo: raw.draw_no,
    drwNoDate: raw.date.slice(0, 10),
    numbers: [...raw.numbers].sort((a, b) => a - b),
    bonus: raw.bonus_no,
  };
}

async function main() {
  console.log(`소스: ${SOURCE_URL}`);
  console.log('다운로드 중...');

  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const raw = await res.json();
  const draws = raw
    .map(transform)
    .filter((d) => d.drwNo && d.numbers.length === 6 && d.bonus)
    .sort((a, b) => a.drwNo - b.drwNo);

  await fs.mkdir(path.dirname(OUTPUT_PATH), { recursive: true });
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(draws));

  const last = draws[draws.length - 1];
  console.log(`\n저장: ${draws.length}회차 → ${OUTPUT_PATH}`);
  console.log(`최신: ${last.drwNo}회 (${last.drwNoDate})`);
}

main().catch((err) => {
  console.error('\n실패:', err.message);
  process.exit(1);
});
