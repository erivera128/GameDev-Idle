import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { GameItem } from '@gamedev-idle/contracts';
import { InfrastructureService } from '../infrastructure/infrastructure.service';
import { rollWriteCodeReward, WRITE_CODE_COOLDOWN_SECONDS } from './balance';

type ItemRow = { id: string; slug: string; name: string; description: string; category: string; rarity: GameItem['rarity']; base_sell_value: number; stack_limit: number; tradable: boolean };

@Injectable()
export class GatheringService {
  constructor(private readonly infrastructure: InfrastructureService) {}
  private item(row: ItemRow): GameItem { return { id: row.id, slug: row.slug, name: row.name, description: row.description, category: row.category, rarity: row.rarity, baseSellValue: row.base_sell_value, stackLimit: row.stack_limit, tradable: row.tradable }; }
  async writeCode(userId: string) {
    return this.infrastructure.transaction(async (client) => {
      await client.query('INSERT INTO player_actions (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [userId]);
      const action = await client.query<{ last_write_code_at: Date }>(`UPDATE player_actions SET last_write_code_at = NOW(), write_code_actions = write_code_actions + 1 WHERE user_id = $1 AND (last_write_code_at IS NULL OR last_write_code_at <= NOW() - INTERVAL '${WRITE_CODE_COOLDOWN_SECONDS} seconds') RETURNING last_write_code_at`, [userId]);
      if (!action.rows[0]) throw new HttpException(`Write Code is available every ${WRITE_CODE_COOLDOWN_SECONDS} seconds.`, HttpStatus.TOO_MANY_REQUESTS);
      const reward = rollWriteCodeReward();
      const itemResult = await client.query<ItemRow>('SELECT id, slug, name, description, category, rarity, base_sell_value, stack_limit, tradable FROM items WHERE slug = $1', [reward.slug]);
      const item = itemResult.rows[0]; if (!item) throw new Error(`Missing seeded item: ${reward.slug}`);
      const inventory = await client.query<{ quantity: number }>(`INSERT INTO inventory AS v (user_id, item_id, quantity) VALUES ($1, $2, $3) ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = v.quantity + EXCLUDED.quantity, updated_at = NOW() WHERE v.quantity + EXCLUDED.quantity <= $4 RETURNING quantity`, [userId, item.id, reward.quantity, item.stack_limit]);
      if (!inventory.rows[0]) throw new HttpException(`${item.name} has reached its stack limit.`, HttpStatus.TOO_MANY_REQUESTS);
      await client.query('INSERT INTO player_currencies (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [userId]);
      await client.query('UPDATE player_currencies SET cash = cash + $2, fans = fans + $3, updated_at = NOW() WHERE user_id = $1', [userId, reward.cash, reward.fans]);
      await client.query('INSERT INTO gathering_log (user_id, action, item_id, quantity, cash_awarded, fans_awarded) VALUES ($1, $2, $3, $4, $5, $6)', [userId, 'write-code', item.id, reward.quantity, reward.cash, reward.fans]);
      return { item: this.item(item), quantity: reward.quantity, cash: reward.cash, fans: reward.fans, nextAvailableAt: new Date(action.rows[0].last_write_code_at.getTime() + WRITE_CODE_COOLDOWN_SECONDS * 1000).toISOString() };
    });
  }
}
