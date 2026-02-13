import { Controller, Post, Request, UseGuards, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { SuccessResponseEnvelopeDTO } from '../../../shared/dtos/response/success-response-envelope.dto';
import { ApiSuccessResponseWithEnvelope } from '../../../shared/decorators/api-success-response-with-envelope.decorators';
import { ApiErrorResponseWithEnvelope } from '../../../shared/decorators/api-error-response-with-envelope.decorators';
import { ErrorResponseEnvelopeDTO } from '../../../shared/dtos/response/error-response-envelope.dto';
import { HttpStatusCodes } from '../../../shared/constants/http-status-codes';
import { RefreshTokenResponseDTO } from '../dtos/response/refresh-token-response.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { AllowExpiredJwt } from '../../../shared/decorators/allow-expired-jwt.decorator';

@Controller('auth')
@ApiTags('Authentication')
@ApiExtraModels(
  SuccessResponseEnvelopeDTO,
  ErrorResponseEnvelopeDTO,
  RefreshTokenResponseDTO,
)
export class AuthController {
  private readonly logger: Logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger(AuthController.name);
  }

  // Handle POST request to refresh the token
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Token refreshed successfully.',
    RefreshTokenResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @AllowExpiredJwt() // Allow access with expired tokens
  public async refreshToken(
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<RefreshTokenResponseDTO>> {
    this.logger.log(`refreshToken :: req.user - ${JSON.stringify(req.user)}`);

    // Call the refreshToken method of the authService to refresh the token
    const responseObj = await this.authService.refreshToken(req.user);
    this.logger.log(
      `refreshToken :: responseObj - ${JSON.stringify(responseObj)}`,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<RefreshTokenResponseDTO> =
      {
        status_code: HttpStatusCodes.OK,
        success: true,
        message: 'Token refreshed successfully.',
        data: responseObj,
      };

    return successResponse;
  }
}
