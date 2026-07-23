export interface HealthStatus {
  status: 'ok' | 'degraded';
  timestamp: string;
  services: { database: 'up' | 'down'; redis: 'up' | 'down' };
}

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface GameItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  rarity: ItemRarity;
  baseSellValue: number;
  stackLimit: number;
  tradable: boolean;
}

export interface InventoryItem extends GameItem {
  quantity: number;
  lockedQuantity: number;
}
