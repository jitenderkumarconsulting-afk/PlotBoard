import { BaseRequestDTO } from '../../../../shared/dtos/request/base/base-request.dto';
import { PositionRequestDTO } from './position-request.dto';

export class EventMoveRequestDTO extends BaseRequestDTO {
  ObjectID: string;
  from: PositionRequestDTO;
  to: PositionRequestDTO;
  data: Record<string, any>;
}
