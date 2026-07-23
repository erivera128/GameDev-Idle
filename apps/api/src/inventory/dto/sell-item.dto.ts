import { IsInt, IsString, Max, Min } from 'class-validator';

export class SellItemDto {
  @IsString()
  itemIdOrSlug!: string;
  @IsInt() @Min(1) @Max(9_999)
  quantity!: number;
}
