import { Controller, Get, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { QuestsService } from './quests.service';

@Controller('quests')
export class QuestsController {
  constructor(private readonly auth: AuthService, private readonly quests: QuestsService) {}
  @Get() async list(@Headers('authorization') authorization?: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.quests.list(user.id); }
  @HttpCode(200) @Post(':slug/claim') async claim(@Headers('authorization') authorization: string | undefined, @Param('slug') slug: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.quests.claim(user.id, slug); }
}
