import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import type { HealthStatus } from '@gamedev-idle/contracts';
import { InfrastructureService } from '../infrastructure/infrastructure.service';
@Controller()
export class HealthController {
  constructor(private readonly infrastructure: InfrastructureService) {}
  @Get('health') async health(): Promise<HealthStatus> { const [database, redis] = await Promise.all([this.infrastructure.checkDatabase(), this.infrastructure.checkRedis()]); const status: HealthStatus = { status: database && redis ? 'ok' : 'degraded', timestamp: new Date().toISOString(), services: { database: database ? 'up' : 'down', redis: redis ? 'up' : 'down' } }; if (status.status === 'degraded') throw new ServiceUnavailableException(status); return status; }
}
