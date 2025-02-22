import { RequestEntity, RequestStatus } from '../entities/request.entity';
import AppDataSource from '../config/db';
import { RequestDto } from '../dto/request.dto';
import { GetRequestDto } from '../dto/getRequests.dto';
import { Brackets } from 'typeorm';
import { CreateRequestDto } from '../dto/createRequest.dto';
import { InsertResult, UpdateResult } from 'typeorm/browser';

const requestRepo = AppDataSource.getRepository(RequestEntity);

class RequestRepository {
  async findRequestById(id: number) {
    return await requestRepo.createQueryBuilder('requests').where('requests.id = :id', { id }).getOne();
  }

  async createRequest(createRequest: CreateRequestDto): Promise<InsertResult> {
    return await requestRepo
      .createQueryBuilder('requests')
      .insert()
      .into(RequestEntity)
      .values(createRequest)
      .execute();
  }

  async updateTakeRequestById(id: number, request: RequestDto): Promise<UpdateResult> {
    return await requestRepo
      .createQueryBuilder('requests')
      .update(RequestEntity)
      .set({
        ...request,
        updatedAt: () => 'CURRENT_TIMESTAMP',
      })
      .where('requests.id = :id', { id })
      .execute();
  }

  async updateAllRequestInProgres(): Promise<UpdateResult> {
    return await requestRepo
      .createQueryBuilder('requests')
      .update(RequestEntity)
      .set({
        status: RequestStatus.CANCELED,
        updatedAt: () => 'CURRENT_TIMESTAMP',
      })
      .where('status = :status', { status: RequestStatus.IN_PROGRESS })
      .execute();
  }

  async getAllRequests({ date, startDate, endDate, limit, offset }: GetRequestDto): Promise<[RequestEntity[], number]> {
    const query = requestRepo.createQueryBuilder('requests');

    if (date) {
      query.andWhere('DATE(requests.createdAt) = :date', { date });
    } else if (startDate && endDate) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('requests.createdAt BETWEEN :startDate AND :endDate', {
            startDate: `${startDate} 00:00:00`,
            endDate: `${endDate} 23:59:59`,
          });
        }),
      );
    } else if (startDate) {
      query.andWhere('requests.createdAt >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('requests.createdAt <= :endDate', { endDate: `${endDate} 23:59:59` });
    }

    return await query.orderBy('requests.createdAt', 'DESC').limit(limit).offset(offset).getManyAndCount();
  }
}

export default new RequestRepository();
