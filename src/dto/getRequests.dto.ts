import { IsNumber, IsString, Min } from 'class-validator';

export class GetRequestDto {
  @IsString()
  date?: string;

  @IsString()
  startDate?: string;

  @IsString()
  endDate?: string;

  @IsNumber()
  @Min(0)
  offset!: number;

  @IsNumber()
  @Min(1)
  limit!: number;
}
