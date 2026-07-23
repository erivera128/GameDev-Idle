import { rollWriteCodeReward, WRITE_CODE_COOLDOWN_SECONDS } from '../apps/api/src/gathering/balance';

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => { state += 0x6d2b79f5; let value = state; value = Math.imul(value ^ (value >>> 15), value | 1); value ^= value + Math.imul(value ^ (value >>> 7), value | 61); return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296; };
}

const minutes = Number(process.argv[2] ?? 30);
const sessions = Number(process.argv[3] ?? 10_000);
const actions = Math.floor((minutes * 60) / WRITE_CODE_COOLDOWN_SECONDS);
let cash = 0; let fans = 0; let resources = 0;
for (let session = 0; session < sessions; session += 1) {
  const random = seededRandom(session + 1);
  for (let action = 0; action < actions; action += 1) { const reward = rollWriteCodeReward(random); cash += reward.cash; fans += reward.fans; resources += reward.quantity; }
}
console.log(JSON.stringify({ minutes, actionsPerSession: actions, sessions, averageCash: +(cash / sessions).toFixed(2), averageFans: +(fans / sessions).toFixed(2), averageResources: +(resources / sessions).toFixed(2), averageCashPerMinute: +(cash / sessions / minutes).toFixed(2) }, null, 2));
