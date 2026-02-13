import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ErrorResponseEnvelopeDTO } from '../dtos/response/error-response-envelope.dto';

/**
 * Decorator function to specify an error response with an envelope structure in Swagger documentation.
 * @param status The HTTP status code of the error response.
 * @param description The description of the error response.
 * @returns A method decorator function.
 */
export function ApiErrorResponseWithEnvelope<T>(
  status: number,
  description: string,
): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    ApiResponse({
      status,
      description,
      content: {
        'application/json': {
          schema: {
            oneOf: [{ $ref: getSchemaPath(ErrorResponseEnvelopeDTO) }],
          },
          example: {
            status_code: status,
            success: false,
            message: 'An error occurred.',
            errors: ['Error message 1', 'Error message 2'],
          },
        },
      },
    })(target, propertyKey, descriptor);
  };
}
