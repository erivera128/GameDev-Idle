import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { HealthController } from './health/health.controller';
import { InfrastructureService } from './infrastructure/infrastructure.service';
import { ItemsController } from './items/items.controller';
import { ItemsService } from './items/items.service';
import { InventoryController } from './inventory/inventory.controller';
import { InventoryService } from './inventory/inventory.service';
import { CurrenciesController } from './currencies/currencies.controller';
import { CurrenciesService } from './currencies/currencies.service';
import { GatheringController } from './gathering/gathering.controller';
import { GatheringService } from './gathering/gathering.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { DashboardService } from './dashboard/dashboard.service';
import { CraftingController } from './crafting/crafting.controller';
import { CraftingService } from './crafting/crafting.service';
import { ExplorationController } from './exploration/exploration.controller';
import { ExplorationService } from './exploration/exploration.service';
@Module({ controllers: [HealthController, AuthController, ItemsController, InventoryController, CurrenciesController, GatheringController, DashboardController, CraftingController, ExplorationController], providers: [InfrastructureService, AuthService, ItemsService, InventoryService, CurrenciesService, GatheringService, DashboardService, CraftingService, ExplorationService] })
export class AppModule {}
