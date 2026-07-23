export const WRITE_CODE_COOLDOWN_SECONDS = 5;

export type WriteCodeReward = { slug: string; quantity: number; cash: number; fans: number };

type LootEntry = { weight: number; reward: (random: () => number) => WriteCodeReward };

// Keep early progression data-driven: these weights total 100 and can be tuned
// without changing gathering transaction or cooldown behavior.
const writeCodeLootTable: LootEntry[] = [
  { weight: 62, reward: (random) => ({ slug: 'source-code', quantity: 1 + Math.floor(random() * 4), cash: 1, fans: 0 }) },
  { weight: 22, reward: (random) => ({ slug: 'bug-report', quantity: 1 + Math.floor(random() * 2), cash: 1, fans: 0 }) },
  { weight: 10, reward: () => ({ slug: 'design-doc', quantity: 1, cash: 2, fans: 1 }) },
  { weight: 5, reward: () => ({ slug: 'pixel-art', quantity: 1, cash: 3, fans: 1 }) },
  { weight: 1, reward: () => ({ slug: 'sound-effect', quantity: 1, cash: 5, fans: 2 }) },
];

export function rollWriteCodeReward(random: () => number = Math.random): WriteCodeReward {
  let roll = random() * 100;
  for (const entry of writeCodeLootTable) {
    roll -= entry.weight;
    if (roll < 0) return entry.reward(random);
  }
  return writeCodeLootTable[writeCodeLootTable.length - 1].reward(random);
}
