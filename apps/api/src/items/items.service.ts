import { Injectable, NotFoundException } from '@nestjs/common';
import type { GameItem, ItemRarity } from '@gamedev-idle/contracts';
import { InfrastructureService } from '../infrastructure/infrastructure.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

type ItemRow = { id: string; slug: string; name: string; description: string; category: string; rarity: ItemRarity; base_sell_value: number; stack_limit: number; tradable: boolean };
const starterCatalog: CreateItemDto[] = [
  { slug: 'source-code', name: 'Source Code', description: 'Reusable snippets written during a focused coding session.', category: 'code', rarity: 'common', baseSellValue: 4, stackLimit: 999, tradable: true },
  { slug: 'bug-report', name: 'Bug Report', description: 'A reproducible issue waiting for a patient developer.', category: 'quality', rarity: 'common', baseSellValue: 2, stackLimit: 999, tradable: true },
  { slug: 'design-doc', name: 'Design Document', description: 'A neatly organized plan for an ambitious game system.', category: 'design', rarity: 'uncommon', baseSellValue: 12, stackLimit: 999, tradable: true },
  { slug: 'pixel-art', name: 'Pixel Art', description: 'A polished sprite sheet ready for the next build.', category: 'art', rarity: 'uncommon', baseSellValue: 15, stackLimit: 999, tradable: true },
  { slug: 'sound-effect', name: 'Sound Effect', description: 'A crisp audio cue that gives every click character.', category: 'audio', rarity: 'rare', baseSellValue: 40, stackLimit: 999, tradable: true },
  { slug: 'prototype-blueprint', name: 'Prototype Blueprint', description: 'A rare plan capable of shaping a major release.', category: 'design', rarity: 'epic', baseSellValue: 125, stackLimit: 99, tradable: true },
];

@Injectable()
export class ItemsService {
  constructor(private readonly infrastructure: InfrastructureService) {}
  private item(row: ItemRow): GameItem { return { id: row.id, slug: row.slug, name: row.name, description: row.description, category: row.category, rarity: row.rarity, baseSellValue: row.base_sell_value, stackLimit: row.stack_limit, tradable: row.tradable }; }
  async seed() { for (const item of starterCatalog) await this.infrastructure.query('INSERT INTO items (slug, name, description, category, rarity, base_sell_value, stack_limit, tradable) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (slug) DO NOTHING', [item.slug, item.name, item.description, item.category, item.rarity, item.baseSellValue, item.stackLimit, item.tradable ?? true]); }
  async list(category?: string, rarity?: ItemRarity) { await this.seed(); const conditions: string[] = []; const values: string[] = []; if (category) { values.push(category); conditions.push(`category = $${values.length}`); } if (rarity) { values.push(rarity); conditions.push(`rarity = $${values.length}`); } const result = await this.infrastructure.query<ItemRow>(`SELECT id, slug, name, description, category, rarity, base_sell_value, stack_limit, tradable FROM items ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''} ORDER BY base_sell_value, name`, values); return result.rows.map((row) => this.item(row)); }
  async get(idOrSlug: string) { const result = await this.infrastructure.query<ItemRow>('SELECT id, slug, name, description, category, rarity, base_sell_value, stack_limit, tradable FROM items WHERE id::text = $1 OR slug = $1', [idOrSlug]); if (!result.rows[0]) throw new NotFoundException('Item not found.'); return this.item(result.rows[0]); }
  async create(input: CreateItemDto) { const result = await this.infrastructure.query<ItemRow>('INSERT INTO items (slug, name, description, category, rarity, base_sell_value, stack_limit, tradable) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, slug, name, description, category, rarity, base_sell_value, stack_limit, tradable', [input.slug, input.name, input.description, input.category, input.rarity, input.baseSellValue, input.stackLimit, input.tradable ?? true]); return this.item(result.rows[0]); }
  async update(idOrSlug: string, input: UpdateItemDto) { const existing = await this.get(idOrSlug); const fields = Object.entries({ name: input.name, description: input.description, category: input.category, rarity: input.rarity, base_sell_value: input.baseSellValue, stack_limit: input.stackLimit, tradable: input.tradable }).filter(([, value]) => value !== undefined); if (!fields.length) return existing; const values = fields.map(([, value]) => value); const assignments = fields.map(([key], index) => `${key} = $${index + 1}`); values.push(existing.id); const result = await this.infrastructure.query<ItemRow>(`UPDATE items SET ${assignments.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING id, slug, name, description, category, rarity, base_sell_value, stack_limit, tradable`, values); return this.item(result.rows[0]); }
  async remove(idOrSlug: string) { const existing = await this.get(idOrSlug); await this.infrastructure.query('DELETE FROM items WHERE id = $1', [existing.id]); }
}
