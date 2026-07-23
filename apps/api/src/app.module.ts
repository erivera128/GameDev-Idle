import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { InfrastructureService } from './infrastructure/infrastructure.service';
@Module({ controllers: [HealthController], providers: [InfrastructureService] })
export class AppModule {}
