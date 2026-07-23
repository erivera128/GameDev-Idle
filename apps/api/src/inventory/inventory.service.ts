import { BadRequestException, Injectable } from '@nestjs/common';
import type { InventoryItem, ItemRarity } from '@gamedev-idle/contracts';
import { InfrastructureService } from '../infrastructure/infrastructure.service';
import { InventoryMutationDto } from './dto/inventory-mutation.dto';

type InventoryRow = { id: string; slug: string; name: string; description: string; category: string; rarity: ItemRarity; base_sell_value: number; stack_limit: number; tradable: boolean; quantity: number; locked_quantity: number };

@Injectable()
export class InventoryService {
  constructor(private readonly infrastructure: InfrastructureService) {}
  private item(row: InventoryRow): InventoryItem { return { id: row.id, slug: row.slug, name: row.name, description: row.description, category: row.category, rarity: row.rarity, baseSellValue: row.base_sell_value, stackLimit: row.stack_limit, tradable: row.tradable, quantity: row.quantity, lockedQuantity: row.locked_quantity }; }
  async list(userId: string) { const result = await this.infrastructure.query<InventoryRow>('SELECT i.id, i.slug, i.name, i.description, i.category, i.rarity, i.base_sell_value, i.stack_limit, i.tradable, v.quantity, v.locked_quantity FROM inventory v JOIN items i ON i.id = v.item_id WHERE v.user_id = $1 ORDER BY i.category, i.rarity, i.name', [userId]); return result.rows.map((row) => this.item(row)); }
  async grant(input: InventoryMutationDto) {
    const result = await this.infrastructure.query<{ quantity: number }>(`INSERT INTO inventory AS v (user_id, item_id, quantity)
      SELECT $1, i.id, $3 FROM items i WHERE (i.id::text = $2 OR i.slug = $2) AND $3 <= i.stack_limit
      ON CONFLICT (user_id, item_id) DO UPDATE SET quantity = v.quantity + EXCLUDED.quantity, updated_at = NOW()
      WHERE v.quantity + EXCLUDED.quantity <= (SELECT stack_limit FROM items WHERE id = v.item_id)
      RETURNING quantity`, [input.userId, input.itemIdOrSlug, input.quantity]);
    if (!result.rows[0]) throw new BadRequestException('Item was not found or the requested quantity exceeds its stack limit.');
    return { quantity: result.rows[0].quantity };
  }
  async remove(input: InventoryMutationDto) {
    const result = await this.infrastructure.query<{ item_id: string; quantity: number }>(`UPDATE inventory AS v SET quantity = quantity - $3, updated_at = NOW()
      WHERE v.user_id = $1 AND v.item_id IN (SELECT id FROM items WHERE id::text = $2 OR slug = $2) AND v.quantity - v.locked_quantity >= $3
      RETURNING item_id, quantity`, [input.userId, input.itemIdOrSlug, input.quantity]);
    const row = result.rows[0]; if (!row) throw new BadRequestException('Not enough unlocked items are available.');
    if (row.quantity === 0) await this.infrastructure.query('DELETE FROM inventory WHERE user_id = $1 AND item_id = $2 AND quantity = 0', [input.userId, row.item_id]);
    return { quantity: row.quantity };
  }
}
