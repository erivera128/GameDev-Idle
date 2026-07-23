import { Controller, Get, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { StudioService } from './studio.service';
@Controller('studio') export class StudioController { constructor(private readonly auth: AuthService, private readonly studio: StudioService) {} @Get() async list(@Headers('authorization') authorization?: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.studio.list(user.id); } @HttpCode(200) @Post('upgrades/:slug/purchase') async purchase(@Headers('authorization') authorization: string | undefined, @Param('slug') slug: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.studio.purchase(user.id, slug); } }
