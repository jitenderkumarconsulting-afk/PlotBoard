import { Controller, Request, UseGuards, Logger, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { SuccessResponseEnvelopeDTO } from '../../../shared/dtos/response/success-response-envelope.dto';
import { ApiSuccessResponseWithEnvelope } from '../../../shared/decorators/api-success-response-with-envelope.decorators';
import { ApiErrorResponseWithEnvelope } from '../../../shared/decorators/api-error-response-with-envelope.decorators';
import { ErrorResponseEnvelopeDTO } from '../../../shared/dtos/response/error-response-envelope.dto';
import { HttpStatusCodes } from '../../../shared/constants/http-status-codes';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { UserResponseDTO } from '../dtos/response/user-response.dto';

@Controller('user')
@ApiTags('Authentication')
@ApiExtraModels(
  SuccessResponseEnvelopeDTO,
  ErrorResponseEnvelopeDTO,
  UserResponseDTO,
)
export class UserController {
  private readonly logger: Logger;

  constructor(private readonly userService: UserService) {
    this.logger = new Logger(UserController.name);
  }

  // Handle GET request to get user info
  @Get('info')
  @ApiOperation({ summary: 'Get user info' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'User info fetched successfully.',
    UserResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while fetching user info from the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async getUserInfo(
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<UserResponseDTO>> {
    this.logger.log(`getUserInfo :: req.user - ${JSON.stringify(req.user)}`);

    // Call the refreshToken method of the authService to refresh the token
    const responseObj = await this.userService.getUserInfo(req.user);
    this.logger.log(
      `getUserInfo :: responseObj - ${JSON.stringify(responseObj)}`,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<UserResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'User info fetched successfully.',
      data: responseObj,
    };

    return successResponse;
  }
}
