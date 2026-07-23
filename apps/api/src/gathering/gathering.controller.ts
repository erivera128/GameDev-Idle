import { Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { GatheringService } from './gathering.service';

@Controller('gathering')
export class GatheringController {
  constructor(private readonly auth: AuthService, private readonly gathering: GatheringService) {}
  @HttpCode(200) @Post('write-code') async writeCode(@Headers('authorization') authorization?: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.gathering.writeCode(user.id); }
}
