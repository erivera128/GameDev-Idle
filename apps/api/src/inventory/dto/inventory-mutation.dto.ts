import { IsInt, IsString, IsUUID, Max, Min } from 'class-validator';

export class InventoryMutationDto {
  @IsUUID()
  userId!: string;
  @IsString()
  itemIdOrSlug!: string;
  @IsInt() @Min(1) @Max(9_999)
  quantity!: number;
}
