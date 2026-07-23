import { Injectable } from '@nestjs/common';
import type { PlayerDashboard, RecentLoot } from '@gamedev-idle/contracts';
import { CurrenciesService } from '../currencies/currencies.service';
import { InfrastructureService } from '../infrastructure/infrastructure.service';
import { InventoryService } from '../inventory/inventory.service';

type LootRow = { item_name: string; quantity: number; cash_awarded: number; fans_awarded: number; occurred_at: Date };
@Injectable()
export class DashboardService {
  constructor(private readonly currencies: CurrenciesService, private readonly inventory: InventoryService, private readonly infrastructure: InfrastructureService) {}
  async get(player: PlayerDashboard['player']): Promise<PlayerDashboard> {
    const [currencies, inventory, loot] = await Promise.all([this.currencies.get(player.id), this.inventory.list(player.id), this.infrastructure.query<LootRow>('SELECT i.name AS item_name, l.quantity, l.cash_awarded, l.fans_awarded, l.occurred_at FROM gathering_log l JOIN items i ON i.id = l.item_id WHERE l.user_id = $1 ORDER BY l.occurred_at DESC LIMIT 5', [player.id])]);
    const recentLoot: RecentLoot[] = loot.rows.map((row) => ({ itemName: row.item_name, quantity: row.quantity, cashAwarded: row.cash_awarded, fansAwarded: row.fans_awarded, occurredAt: row.occurred_at.toISOString() }));
    return { player, currencies, inventoryStacks: inventory.length, inventoryItems: inventory.reduce((total, item) => total + item.quantity, 0), recentLoot };
  }
}
