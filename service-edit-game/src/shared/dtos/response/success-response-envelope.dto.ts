import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseEnvelopeDTO } from './base/base-response-envelope.dto';

/**
 * Success Response Envelope DTO
 *
 * This class represents a success response envelope that wraps the data payload returned in the response.
 * It extends the `BaseResponseEnvelopeDTO` class to inherit common response fields like `status_code`, `success`, and `message`.
 *
 * @template T - The type of data payload to be returned in the response.
 */
export class SuccessResponseEnvelopeDTO<T> extends BaseResponseEnvelopeDTO {
  // data field
  @ApiProperty({
    name: 'data',
    type: Object,
    description: 'Data payload returned in the response',
    example: {},
  })
  data: T;
}
