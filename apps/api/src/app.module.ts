import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HealthController } from './health/health.controller';
import { InfrastructureService } from './infrastructure/infrastructure.service';
@Module({ controllers: [HealthController, AuthController], providers: [InfrastructureService, AuthService] })
export class AppModule {}
