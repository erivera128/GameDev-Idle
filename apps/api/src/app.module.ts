import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HealthController } from './health/health.controller';
import { InfrastructureService } from './infrastructure/infrastructure.service';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
@Module({ controllers: [HealthController, AuthController, ItemsController, InventoryController], providers: [InfrastructureService, AuthService, ItemsService, InventoryService] })
export class AppModule {}
