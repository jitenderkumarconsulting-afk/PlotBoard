import { BaseRequestDTO } from './base/base-request.dto';

export class PublishEventRequestDTO<
  T = Record<string, any>,
> extends BaseRequestDTO {
  // Data property
  data: T;

  // Game Token property
  gameToken: string;

  // User ID property
  userId: string;
}
