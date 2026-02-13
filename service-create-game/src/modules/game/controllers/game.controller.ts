import {
  Controller,
  Post,
  Request,
  UseGuards,
  Logger,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { SuccessResponseEnvelopeDTO } from '../../../shared/dtos/response/success-response-envelope.dto';
import { ApiSuccessResponseWithEnvelope } from '../../../shared/decorators/api-success-response-with-envelope.decorators';
import { ApiErrorResponseWithEnvelope } from '../../../shared/decorators/api-error-response-with-envelope.decorators';
import { ErrorResponseEnvelopeDTO } from '../../../shared/dtos/response/error-response-envelope.dto';
import { HttpStatusCodes } from '../../../shared/constants/http-status-codes';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { GameResponseDTO } from '../dtos/response/game-response.dto';
import { GameService } from '../services/game.service';
import { CreateGameRequestDTO } from '../dtos/request/create-game-request.dto';

@Controller('games')
@ApiTags('Games')
@ApiExtraModels(
  SuccessResponseEnvelopeDTO,
  ErrorResponseEnvelopeDTO,
  GameResponseDTO,
)
export class GameController {
  private readonly logger: Logger;

  constructor(private readonly gameService: GameService) {
    this.logger = new Logger(GameController.name);
  }

  // Handle POST request to create a new game
  @Post('')
  @ApiOperation({ summary: 'Create Game' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game created successfully.',
    GameResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.BAD_REQUEST,
    'Invalid request. Please check the request body for errors.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.CONFLICT,
    'Game with the same name already exists.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while saving game to the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async createGame(
    @Body() createGameRequestDTO: CreateGameRequestDTO,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameResponseDTO>> {
    this.logger.log(
      `createGame :: createGameRequestDTO - ${JSON.stringify(
        createGameRequestDTO,
      )}`,
    );

    // Call the createGameRequest method of the gameService to create a new game
    const responseObj = await this.gameService.createGameRequest(
      createGameRequestDTO,
      req.user,
    );
    this.logger.log(
      `createGame :: responseObj - ${JSON.stringify(responseObj)}`,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game created successfully.',
      data: responseObj,
    };

    return successResponse;
  }
}
