import { Body, Controller, Get, Headers, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AdjustCurrenciesDto } from './dto/adjust-currencies.dto';
import { CurrenciesService } from './currencies.service';

@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly auth: AuthService, private readonly currencies: CurrenciesService) {}
  private gameKey(key?: string) { if (!process.env.GAME_SERVER_KEY || key !== process.env.GAME_SERVER_KEY) throw new UnauthorizedException('A valid game server key is required.'); }
  @Get() async get(@Headers('authorization') authorization?: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.currencies.get(user.id); }
  @HttpCode(200) @Post('adjust') adjust(@Headers('x-game-key') key: string | undefined, @Body() input: AdjustCurrenciesDto) { this.gameKey(key); return this.currencies.adjust(input); }
}
