import {
  Controller,
  Post,
  Request,
  UseGuards,
  Logger,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExtraModels } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { SignInResponseDTO } from '../dtos/response/sign-in-response.dto';
import { SuccessResponseEnvelopeDTO } from '../../../shared/dtos/response/success-response-envelope.dto';
import { ApiSuccessResponseWithEnvelope } from '../../../shared/decorators/api-success-response-with-envelope.decorators';
import { ApiErrorResponseWithEnvelope } from '../../../shared/decorators/api-error-response-with-envelope.decorators';
import { ErrorResponseEnvelopeDTO } from '../../../shared/dtos/response/error-response-envelope.dto';
import { HttpStatusCodes } from '../../../shared/constants/http-status-codes';
import { SignInRequestDTO } from '../dtos/request/sign-in-request.dto';
import { LocalAuthGuard } from '../../../shared/guards/local-auth.guard';

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

  // Handle POST request for user sign-in
  @Post('sign-in')
  @ApiOperation({ summary: 'User SignIn' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'User signed in successfully.',
    SignInResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.BAD_REQUEST,
    'Invalid request. Please check the request body for errors.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.UNAUTHORIZED,
    'Invalid email or password.',
  )
  @UseGuards(LocalAuthGuard)
  public async signIn(
    @Body() signInRequestDTO: SignInRequestDTO,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<SignInResponseDTO>> {
    this.logger.log(
      `signIn :: signInRequestDTO - ${JSON.stringify(signInRequestDTO)}`,
    );
    this.logger.log(`signIn :: req.user - ${JSON.stringify(req.user)}`);

    // Call the signIn method of the authService to authenticate the user
    const responseObj = await this.authService.signIn(req.user);
    this.logger.log(`signIn :: responseObj - ${JSON.stringify(responseObj)}`);

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<SignInResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'User signed in successfully.',
      data: responseObj,
    };

    return successResponse;
  }
}
