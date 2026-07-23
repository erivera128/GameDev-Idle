import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { Pool, QueryResultRow } from 'pg';
@Injectable()
export class InfrastructureService implements OnModuleInit, OnModuleDestroy {
  private readonly database = new Pool({ connectionString: process.env.DATABASE_URL });
  async onModuleInit() {
    await this.database.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await this.database.query(`CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), username VARCHAR(32) NOT NULL UNIQUE, email VARCHAR(255) NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), last_login TIMESTAMPTZ)`);
    await this.database.query(`CREATE TABLE IF NOT EXISTS user_sessions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, refresh_token_hash TEXT NOT NULL UNIQUE, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), revoked_at TIMESTAMPTZ)`);
    await this.database.query('CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id)');
    await this.database.query(`CREATE TABLE IF NOT EXISTS items (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug VARCHAR(64) NOT NULL UNIQUE, name VARCHAR(80) NOT NULL, description TEXT NOT NULL, category VARCHAR(32) NOT NULL, rarity VARCHAR(16) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')), base_sell_value INTEGER NOT NULL CHECK (base_sell_value >= 0), stack_limit INTEGER NOT NULL CHECK (stack_limit BETWEEN 1 AND 9999), tradable BOOLEAN NOT NULL DEFAULT TRUE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`);
    await this.database.query('CREATE INDEX IF NOT EXISTS items_category_idx ON items(category)');
    await this.database.query(`CREATE TABLE IF NOT EXISTS inventory (user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, item_id UUID NOT NULL REFERENCES items(id) ON DELETE RESTRICT, quantity INTEGER NOT NULL CHECK (quantity > 0), locked_quantity INTEGER NOT NULL DEFAULT 0 CHECK (locked_quantity BETWEEN 0 AND quantity), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (user_id, item_id))`);
  }
  async onModuleDestroy() { await this.database.end(); }
  async query<T extends QueryResultRow>(text: string, values: unknown[] = []) { return this.database.query<T>(text, values); }
  async checkDatabase(): Promise<boolean> { try { await this.database.query('SELECT 1'); return true; } catch { return false; } }
  async checkRedis(): Promise<boolean> { const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', { connectTimeout: 1_500, maxRetriesPerRequest: 1, lazyConnect: true }); try { await redis.connect(); return (await redis.ping()) === 'PONG'; } catch { return false; } finally { await redis.quit().catch(() => undefined); } }
}
