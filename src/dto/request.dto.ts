import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { RequestStatus, RequestEntity } from '../entities/request.entity.js';

export class RequestDto {
  @IsInt()
  id?: RequestEntity['id'];

  @IsString()
  @IsNotEmpty()
  topic?: RequestEntity['topic'];

  @IsString()
  @IsNotEmpty()
  text!: RequestEntity['text'];

  @IsEnum(RequestStatus)
  status!: RequestStatus;

  @IsString()
  resolution?: RequestEntity['resolution'];

  @IsString()
  cancelReason?: RequestEntity['cancelReason'];
}
