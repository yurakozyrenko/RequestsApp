import { RequestEntity, RequestStatus } from '../entities/request.entity';
import requestRepository from '../providers/request.repository';
import { GetRequestDto } from '../dto/getRequests.dto';
import { CreateRequestDto } from '../dto/createRequest.dto';
import ApiError from '../error/ApiError';

class RequestService {
  private logger = console;

  async getRequestById(id: number): Promise<RequestEntity> {
    this.logger.log(`Trying to get request by id: ${id}`);

    const request = await requestRepository.findRequestById(id);
    if (!request) {
      throw ApiError.notFound(`Request with ID ${id} not found`);
    }
    this.logger.debug(`request successfully get by id: ${id}`);

    return request;
  }

  // 1) Создать обращение
  async create(topic: string, text: string) {
    this.logger.log(`Trying to create request with ${text} and ${topic}`);

    const createRequest: CreateRequestDto = { topic, text, status: RequestStatus.NEW };

    const { raw } = await requestRepository.createRequest(createRequest);

    this.logger.debug(`request successfully created with id: ${raw[0].id}`);
  }

  //   2) Взять обращение в работу
  async takeRequest(id: number) {
    this.logger.log(`Trying to take request with id: ${id}`);

    const request = await this.getRequestById(id);

    if (request.status !== RequestStatus.NEW) {
      throw ApiError.notFound(`Request with ID ${id} not status NEW`);
    }

    request.status = RequestStatus.IN_PROGRESS;

    const { affected } = await requestRepository.updateTakeRequestById(id, request);

    this.logger.debug(`${affected} request successfully updated take with id: ${id}`);
  }

  //   3) Завершить обработку обращения
  async completeRequest(id: number, resolution: string) {
    this.logger.log(`Trying to complete request with id: ${id}`);

    const request = await this.getRequestById(id);

    if (request.status !== RequestStatus.IN_PROGRESS) {
      throw ApiError.notFound(`Request with ID ${id} not status IN_PROGRESS`);
    }

    request.status = RequestStatus.COMPLETED;

    request.resolution = resolution;

    const { affected } = await requestRepository.updateTakeRequestById(id, request);

    this.logger.debug(`${affected} request successfully updated completed with id: ${id}`);
  }

  //   4) Отмена обращения
  async cancelRequest(id: number, cancelReason: string) {
    this.logger.log(`Trying to cancel request with id: ${id}`);
    const request = await this.getRequestById(id);

    if (request.status === RequestStatus.COMPLETED || request.status === RequestStatus.CANCELED) {
      throw ApiError.notFound(`Request with ID ${id} already status COMPLETED or CANCELED`);
    }

    request.status = RequestStatus.CANCELED;
    request.cancelReason = cancelReason;

    const { affected } = await requestRepository.updateTakeRequestById(id, request);

    this.logger.debug(`${affected} request successfully canceled with id: ${id}`);
  }

  // 5) Получить список обращений с фильтрацией по дате
  async getAllRequests(
    page: number,
    limit: number,
    date?: string,
    startDate?: string,
    endDate?: string,
  ): Promise<RequestEntity[]> {
    this.logger.log(`Trying to get list requests`);

    const offset = (page - 1) * limit;
    const getRequestsDto: GetRequestDto = {
      date,
      startDate,
      endDate,
      limit,
      offset,
    };

    const [requests, count] = await requestRepository.getAllRequests(getRequestsDto);

    this.logger.debug(`${count} requests successfully get`);

    return requests;
  }

  // 6) отменит все обращения, которые находятся в статусе "в работе"
  async cancelAllRequestInProgres(): Promise<number> {
    this.logger.log(`Trying to cancel all request in progress`);

    const { affected } = await requestRepository.updateAllRequestInProgres();

    this.logger.debug(`${affected} request successfully canceled`);
    return affected ?? 0;
  }
}

export default new RequestService();
