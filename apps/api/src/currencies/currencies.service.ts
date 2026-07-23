import { BadRequestException, Injectable } from '@nestjs/common';
import type { CurrencyBalance } from '@gamedev-idle/contracts';
import { InfrastructureService } from '../infrastructure/infrastructure.service';
import { AdjustCurrenciesDto } from './dto/adjust-currencies.dto';

type CurrencyRow = { cash: string; fans: number; reputation: number };
@Injectable()
export class CurrenciesService {
  constructor(private readonly infrastructure: InfrastructureService) {}
  private balance(row: CurrencyRow): CurrencyBalance { return { cash: Number(row.cash), fans: row.fans, reputation: row.reputation }; }
  async get(userId: string) { await this.infrastructure.query('INSERT INTO player_currencies (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [userId]); const result = await this.infrastructure.query<CurrencyRow>('SELECT cash, fans, reputation FROM player_currencies WHERE user_id = $1', [userId]); return this.balance(result.rows[0]); }
  async adjust(input: AdjustCurrenciesDto) {
    await this.get(input.userId);
    const cash = input.cash ?? 0; const fans = input.fans ?? 0; const reputation = input.reputation ?? 0;
    if (!cash && !fans && !reputation) throw new BadRequestException('At least one currency adjustment is required.');
    const result = await this.infrastructure.query<CurrencyRow>(`UPDATE player_currencies SET cash = cash + $2, fans = fans + $3, reputation = reputation + $4, updated_at = NOW()
      WHERE user_id = $1 AND cash + $2 >= 0 AND fans + $3 >= 0 AND reputation + $4 >= 0 RETURNING cash, fans, reputation`, [input.userId, cash, fans, reputation]);
    if (!result.rows[0]) throw new BadRequestException('Currency adjustment would produce a negative balance.');
    return this.balance(result.rows[0]);
  }
}
