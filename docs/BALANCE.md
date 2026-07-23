# Early-game balance

## Write Code

Write Code is the first progression action. It has a **5-second server-enforced cooldown** (12 actions per minute) and uses the following reward table.

| Reward | Chance | Quantity | Cash | Fans |
| --- | ---: | ---: | ---: | ---: |
| Source Code | 62% | 1–4 | 1 | 0 |
| Bug Report | 22% | 1–2 | 1 | 0 |
| Design Document | 10% | 1 | 2 | 1 |
| Pixel Art | 5% | 1 | 3 | 1 |
| Sound Effect | 1% | 1 | 5 | 2 |

### Target first-session outcomes

The current tuning targets a focused 30-minute session:

- Around 360 actions at the cooldown cap.
- Around 446 Cash, 65 Fans, and 735 resources on average.
- First 100 Cash in roughly 7 minutes of active gathering.
- Source Code remains below its 999-item stack cap during the first 30 minutes on average.

Rewards, cooldown state, inventory changes, currencies, and gathering history are stored in one database transaction. A repeated action inside the cooldown window returns HTTP 429 and grants nothing, preventing client-side rapid-click exploits.

## Simulation

Run a deterministic Monte Carlo simulation with:

```powershell
corepack pnpm --filter @gamedev-idle/worker exec tsx ../../scripts/simulate-balance.ts 30 10000
```

Arguments are session minutes and number of simulated sessions. Update the reward table in `apps/api/src/gathering/balance.ts`, rerun the simulation, then update this document when tuning progression.
