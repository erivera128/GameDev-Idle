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

export interface CurrencyBalance {
  cash: number;
  fans: number;
  reputation: number;
}

export interface RecentLoot {
  itemName: string;
  quantity: number;
  cashAwarded: number;
  fansAwarded: number;
  occurredAt: string;
}

export interface PlayerDashboard {
  player: { id: string; username: string; email: string };
  currencies: CurrencyBalance;
  inventoryStacks: number;
  inventoryItems: number;
  recentLoot: RecentLoot[];
}

export interface RecipeIngredient { itemSlug: string; itemName: string; quantity: number; }
export interface Recipe { id: string; slug: string; name: string; description: string; durationSeconds: number; output: { itemSlug: string; itemName: string; quantity: number }; ingredients: RecipeIngredient[]; }
export interface CraftingJob { id: string; recipeName: string; status: 'crafting' | 'completed'; completesAt: string; durationSeconds: number; outputItemName: string; outputQuantity: number; }

export interface ExplorationLocation { id: string; slug: string; name: string; description: string; durationSeconds: number; reward: { itemSlug: string; itemName: string; minQuantity: number; maxQuantity: number }; }
export interface Expedition { id: string; locationName: string; status: 'exploring' | 'completed'; completesAt: string; durationSeconds: number; rewardItemName: string; rewardQuantity: number | null; }

export interface Quest { slug: string; title: string; description: string; npcName: string; npcRole: string; requirement: { itemName: string; quantity: number }; rewards: { cash: number; fans: number; reputation: number }; status: 'available' | 'completed'; claimable: boolean; }
