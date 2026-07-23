import { Body, Controller, Get, Headers, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { InventoryMutationDto } from './dto/inventory-mutation.dto';
import { SellItemDto } from './dto/sell-item.dto';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly auth: AuthService, private readonly inventory: InventoryService) {}
  private gameKey(key?: string) { if (!process.env.GAME_SERVER_KEY || key !== process.env.GAME_SERVER_KEY) throw new UnauthorizedException('A valid game server key is required.'); }
  @Get() async list(@Headers('authorization') authorization?: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.inventory.list(user.id); }
  @HttpCode(200) @Post('grant') grant(@Headers('x-game-key') key: string | undefined, @Body() input: InventoryMutationDto) { this.gameKey(key); return this.inventory.grant(input); }
  @HttpCode(200) @Post('remove') remove(@Headers('x-game-key') key: string | undefined, @Body() input: InventoryMutationDto) { this.gameKey(key); return this.inventory.remove(input); }
  @HttpCode(200) @Post('sell') async sell(@Headers('authorization') authorization: string | undefined, @Body() input: SellItemDto) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.inventory.sell(user.id, input); }
}
