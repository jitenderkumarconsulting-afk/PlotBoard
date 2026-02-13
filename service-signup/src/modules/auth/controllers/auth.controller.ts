import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { SignUpRequestDTO } from '../dtos/request/sign-up-request.dto';
import { SignInResponseDTO } from '../dtos/response/sign-in-response.dto';
import { SuccessResponseEnvelopeDTO } from '../../../shared/dtos/response/success-response-envelope.dto';
import { ApiSuccessResponseWithEnvelope } from '../../../shared/decorators/api-success-response-with-envelope.decorators';
import { ApiErrorResponseWithEnvelope } from '../../../shared/decorators/api-error-response-with-envelope.decorators';
import { ErrorResponseEnvelopeDTO } from '../../../shared/dtos/response/error-response-envelope.dto';
import { HttpStatusCodes } from '../../../shared/constants/http-status-codes';

@Controller('auth')
@ApiTags('Authentication')
@ApiExtraModels(
  SuccessResponseEnvelopeDTO,
  ErrorResponseEnvelopeDTO,
  SignInResponseDTO,
)
export class AuthController {
  private readonly logger: Logger;

  constructor(
    private readonly authService: AuthService, // Inject AuthService
  ) {
    this.logger = new Logger(AuthController.name);
  }

  // Handle POST request for user sign-up
  @Post('sign-up')
  @ApiOperation({ summary: 'User SignUp' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.CREATED,
    'User registered and signed in successfully.',
    SignInResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.BAD_REQUEST,
    'Invalid request. Please check the request body for errors.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.CONFLICT,
    'Email already registered.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while saving user to the database.',
  )
  public async signUpAndSignIn(
    @Body() signUpRequestDTO: SignUpRequestDTO,
  ): Promise<SuccessResponseEnvelopeDTO<SignInResponseDTO>> {
    this.logger.log(
      `signUpAndSignIn :: signUpRequestDTO - ${JSON.stringify(
        signUpRequestDTO,
      )}`,
    );

    // Call the sign-up-and-sign-in method of the authService
    const responseObj = await this.authService.signUpAndSignIn(
      signUpRequestDTO,
    );
    this.logger.log(
      `signUpAndSignIn :: responseObj - ${JSON.stringify(responseObj)}`,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<SignInResponseDTO> = {
      status_code: HttpStatusCodes.CREATED,
      success: true,
      message: 'User registered and signed in successfully.',
      data: responseObj,
    };

    return successResponse;
  }
}
