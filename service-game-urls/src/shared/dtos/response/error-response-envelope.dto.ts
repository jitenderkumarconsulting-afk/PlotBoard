import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseEnvelopeDTO } from './base/base-response-envelope.dto';

/**
 * Error Response Envelope DTO
 *
 * This class represents an error response envelope that wraps an array of error messages.
 * It extends the `BaseResponseEnvelopeDTO` class to inherit common response fields like `status_code`, `success`, and `message`.
 */
export class ErrorResponseEnvelopeDTO extends BaseResponseEnvelopeDTO {
  // errors field
  @ApiProperty({
    name: 'errors',
    type: Array,
    items: { type: 'string' },
    description: 'Array of error messages',
    example: [
      'Email must be a valid email address.',
      'Password must be between 6 and 20 characters.',
    ],
  })
  errors: string[];
}
