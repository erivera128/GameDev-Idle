import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';

export class CreateItemDto {
  @IsString() @Length(3, 64) @Matches(/^[a-z0-9-]+$/)
  slug!: string;
  @IsString() @Length(2, 80)
  name!: string;
  @IsString() @Length(1, 500)
  description!: string;
  @IsString() @Length(2, 32)
  category!: string;
  @IsIn(['common', 'uncommon', 'rare', 'epic', 'legendary'])
  rarity!: string;
  @IsInt() @Min(0) @Max(1_000_000)
  baseSellValue!: number;
  @IsInt() @Min(1) @Max(9_999)
  stackLimit!: number;
  @IsOptional() @IsBoolean()
  tradable?: boolean;
}
