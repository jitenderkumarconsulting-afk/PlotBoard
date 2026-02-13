import { BaseRequestDTO } from '../../../../shared/dtos/request/base/base-request.dto';

export class PositionRequestDTO extends BaseRequestDTO {
  Row: number;
  Column: number;
}
