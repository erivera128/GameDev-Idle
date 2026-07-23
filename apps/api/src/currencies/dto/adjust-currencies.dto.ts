import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class AdjustCurrenciesDto {
  @IsUUID()
  userId!: string;
  @IsOptional() @IsInt() @Min(-1_000_000) @Max(1_000_000)
  cash?: number;
  @IsOptional() @IsInt() @Min(-1_000_000) @Max(1_000_000)
  fans?: number;
  @IsOptional() @IsInt() @Min(-1_000_000) @Max(1_000_000)
  reputation?: number;
}
