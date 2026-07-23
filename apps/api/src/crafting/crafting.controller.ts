import { Body, Controller, Get, Headers, HttpCode, Param, Post } from '@nestjs/common';
import { IsString, Matches } from 'class-validator';
import { AuthService } from '../auth/auth.service';
import { CraftingService } from './crafting.service';

class StartCraftDto {
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  recipeSlug!: string;
}
@Controller('crafting')
export class CraftingController {
  constructor(private readonly auth: AuthService, private readonly crafting: CraftingService) {}
  @Get('recipes') recipes() { return this.crafting.listRecipes(); }
  @Get('jobs') async jobs(@Headers('authorization') authorization?: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.crafting.listJobs(user.id); }
  @HttpCode(201) @Post('jobs') async start(@Headers('authorization') authorization: string | undefined, @Body() input: StartCraftDto) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.crafting.start(user.id, input.recipeSlug); }
  @HttpCode(200) @Post('jobs/:jobId/claim') async claim(@Headers('authorization') authorization: string | undefined, @Param('jobId') jobId: string) { const user = await this.auth.me(authorization?.replace(/^Bearer\s+/i, '')); return this.crafting.claim(user.id, jobId); }
}
