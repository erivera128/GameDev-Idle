import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class UpdateItemDto {
  @IsOptional() @IsString() @Length(2, 80)
  name?: string;
  @IsOptional() @IsString() @Length(1, 500)
  description?: string;
  @IsOptional() @IsString() @Length(2, 32)
  category?: string;
  @IsOptional() @IsIn(['common', 'uncommon', 'rare', 'epic', 'legendary'])
  rarity?: string;
  @IsOptional() @IsInt() @Min(0) @Max(1_000_000)
  baseSellValue?: number;
  @IsOptional() @IsInt() @Min(1) @Max(9_999)
  stackLimit?: number;
  @IsOptional() @IsBoolean()
  tradable?: boolean;
}
