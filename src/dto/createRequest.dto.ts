import { IsEnum, IsString } from 'class-validator';
import { RequestStatus } from '../entities/request.entity.js';

export class CreateRequestDto {
  @IsString()
  topic!: string;

  @IsString()
  text!: string;

  @IsEnum(RequestStatus)
  status!: RequestStatus;
}
