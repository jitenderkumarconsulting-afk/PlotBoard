import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { SuccessResponseEnvelopeDTO } from '../dtos/response/success-response-envelope.dto';

/**
 * Decorator function to specify a success response with an envelope structure in Swagger documentation.
 * @param status The HTTP status code of the success response.
 * @param description The description of the success response.
 * @param type The class type of the data payload.
 * @returns A method decorator function.
 */
export function ApiSuccessResponseWithEnvelope<T>(
  status: number,
  description: string,
  type: new () => T,
): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    // Construct the envelope schema with the specified data type
    const envelopeSchema = {
      $ref: getSchemaPath(SuccessResponseEnvelopeDTO), // Reference to the SuccessResponseEnvelopeDTO schema
      properties: {
        data: {
          $ref: getSchemaPath(type), // Reference to the schema of the specified data type
        },
      },
    };

    ApiResponse({
      status,
      description,
      schema: {
        oneOf: [envelopeSchema, { $ref: getSchemaPath(type) }], // Allow either the envelope schema or the data type schema
      },
    })(target, propertyKey, descriptor);
  };
}
