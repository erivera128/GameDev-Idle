import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Client } from 'pg';
@Injectable()
export class InfrastructureService {
  async checkDatabase(): Promise<boolean> { const client = new Client({ connectionString: process.env.DATABASE_URL }); try { await client.connect(); await client.query('SELECT 1'); return true; } catch { return false; } finally { await client.end().catch(() => undefined); } }
  async checkRedis(): Promise<boolean> { const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', { connectTimeout: 1_500, maxRetriesPerRequest: 1, lazyConnect: true }); try { await redis.connect(); return (await redis.ping()) === 'PONG'; } catch { return false; } finally { await redis.quit().catch(() => undefined); } }
}
