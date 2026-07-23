import { Controller, Get, Headers } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly auth: AuthService, private readonly dashboard: DashboardService) {}
  @Get() async get(@Headers('authorization') authorization?: string) { const player = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.dashboard.get(player); }
}
