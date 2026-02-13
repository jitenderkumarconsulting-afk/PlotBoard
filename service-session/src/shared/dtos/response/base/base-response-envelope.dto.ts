import { ApiProperty } from '@nestjs/swagger';

/**
 * Base Response Envelope DTO
 *
 * This class represents the base response envelope that contains common fields used in API responses.
 * All other response envelope DTOs should extend this class to inherit these common fields.
 */
export class BaseResponseEnvelopeDTO {
  // statusCode field
  @ApiProperty({
    name: 'status_code',
    type: Number,
    description: 'HTTP status code of the response',
    example: 200,
  })
  status_code: number;

  // success field
  @ApiProperty({
    name: 'success',
    type: Boolean,
    description: 'Indicates whether the request was successful or not',
    example: true,
  })
  success: boolean;

  // message field
  @ApiProperty({
    name: 'message',
    type: String,
    description: 'Response message providing additional information',
    example: 'Request processed successfully',
  })
  message: string;
}
