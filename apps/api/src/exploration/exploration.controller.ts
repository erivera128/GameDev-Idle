import { Body, Controller, Get, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';
import { AuthService } from '../auth/auth.service';
import { ExplorationService } from './exploration.service';

class StartExpeditionDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  locationSlug!: string;
}

@Controller('exploration')
export class ExplorationController {
  constructor(private readonly auth: AuthService, private readonly exploration: ExplorationService) {}
  @Get('locations') locations() { return this.exploration.listLocations(); }
  @Get('expeditions') async expeditions(@Headers('authorization') authorization?: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.exploration.listExpeditions(user.id); }
  @HttpCode(201) @Post('expeditions') async start(@Headers('authorization') authorization: string | undefined, @Body() input: StartExpeditionDto) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.exploration.start(user.id, input.locationSlug); }
  @HttpCode(200) @Post('expeditions/:expeditionId/claim') async claim(@Headers('authorization') authorization: string | undefined, @Param('expeditionId') expeditionId: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.exploration.claim(user.id, expeditionId); }
}
