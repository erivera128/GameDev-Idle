import { Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, Query, UnauthorizedException } from '@nestjs/common';
import type { ItemRarity } from '@gamedev-idle/contracts';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly items: ItemsService) {}
  private authorize(contentKey?: string) { if (!process.env.CONTENT_API_KEY || contentKey !== process.env.CONTENT_API_KEY) throw new UnauthorizedException('A valid content key is required.'); }
  @Get() list(@Query('category') category?: string, @Query('rarity') rarity?: ItemRarity) { return this.items.list(category, rarity); }
  @Get(':idOrSlug') get(@Param('idOrSlug') idOrSlug: string) { return this.items.get(idOrSlug); }
  @Post() create(@Headers('x-content-key') key: string | undefined, @Body() input: CreateItemDto) { this.authorize(key); return this.items.create(input); }
  @Patch(':idOrSlug') update(@Headers('x-content-key') key: string | undefined, @Param('idOrSlug') idOrSlug: string, @Body() input: UpdateItemDto) { this.authorize(key); return this.items.update(idOrSlug, input); }
  @HttpCode(204) @Delete(':idOrSlug') async remove(@Headers('x-content-key') key: string | undefined, @Param('idOrSlug') idOrSlug: string) { this.authorize(key); await this.items.remove(idOrSlug); }
}
