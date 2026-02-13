import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

import { ErrorResponseEnvelopeDTO } from '../dtos/response/error-response-envelope.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(HttpExceptionFilter.name);
  }

  /**
   * Handle the exception and generate an error response.
   * @param exception The HttpException instance.
   * @param host The arguments host containing the execution context.
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    this.logger.log('catch');

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Create the error response object
    const errorResponse: ErrorResponseEnvelopeDTO = {
      status_code: status,
      success: false,
      message: exception.message || 'Internal server error',
      errors: [],
    };
    this.logger.log(
      `catch :: errorResponse - ${JSON.stringify(errorResponse)}`,
    );

    if (exception instanceof NotFoundException) {
      // Customize the response for NotFoundException
      errorResponse.message = exception.message || 'Resource not found';
    } else if (exception instanceof UnauthorizedException) {
      // Customize the response for UnauthorizedException
      errorResponse.message = exception.message || 'Unauthorized';
    } else if (status === HttpStatus.BAD_REQUEST) {
      // Customize the response for validation errors
      errorResponse.message =
        'Invalid request. Please check the request body for errors.';
      const errors = this.getValidationErrors(exception);
      errorResponse.errors = errors;
    }

    this.logger.log(
      `catch :: errorResponse - ${JSON.stringify(errorResponse)}`,
    );

    // Send the error response
    response.status(status).json(errorResponse);
  }

  /**
   * Get the validation errors from the exception.
   * @param exception The HttpException instance.
   * @returns An array of validation error messages.
   */
  private getValidationErrors(exception: HttpException): string[] {
    this.logger.log('getValidationErrors');

    const validationErrors: string[] = [];
    const errors = exception.getResponse()['message'];

    this.logger.log(
      `getValidationErrors :: errors - ${JSON.stringify(errors)}`,
    );

    if (errors instanceof Array) {
      for (const error of errors) {
        if (error instanceof ValidationError) {
          this.flattenValidationErrors(error, validationErrors);
        } else {
          validationErrors.push(error);
        }
      }
    } else {
      validationErrors.push(errors);
    }

    this.logger.log(
      `getValidationErrors :: validationErrors - ${JSON.stringify(
        validationErrors,
      )}`,
    );

    return validationErrors;
  }

  /**
   * Flatten the validation errors into a single array.
   * @param error The ValidationError instance.
   * @param errorsArray The array to store the flattened errors.
   */
  private flattenValidationErrors(
    error: ValidationError,
    errorsArray: string[],
  ) {
    this.logger.log('flattenValidationErrors');

    for (const key in error.constraints) {
      if (error.constraints.hasOwnProperty(key)) {
        errorsArray.push(error.constraints[key]);
      }
    }

    if (error.children && error.children.length > 0) {
      for (const childError of error.children) {
        this.flattenValidationErrors(childError, errorsArray);
      }
    }
  }
}
