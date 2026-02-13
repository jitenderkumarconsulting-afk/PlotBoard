import {
  Controller,
  Param,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

import { GameService } from '../services/game.service';
import { HttpStatusCodes } from '../../../shared/constants/http-status-codes';
import { ApiErrorResponseWithEnvelope } from '../../../shared/decorators/api-error-response-with-envelope.decorators';
import { ErrorResponseEnvelopeDTO } from '../../../shared/dtos/response/error-response-envelope.dto';
import { ApiSuccessResponseWithEnvelope } from '../../../shared/decorators/api-success-response-with-envelope.decorators';
import { SuccessResponseEnvelopeDTO } from '../../../shared/dtos/response/success-response-envelope.dto';
import { GameStateResponseDTO } from '../dtos/response/game-state-response.dto';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';

@Controller('games')
@ApiTags('Games')
@ApiExtraModels(
  SuccessResponseEnvelopeDTO,
  ErrorResponseEnvelopeDTO,
  GameStateResponseDTO,
)
export class GameController {
  private readonly logger: Logger;

  constructor(private readonly gameService: GameService) {
    this.logger = new Logger(GameController.name);
  }

  /**
   * Handle POST request to create an entry for game state if not exists for play game URL code.
   * @param urlCode The play game URL code of the game state.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing the fetched game state.
   */
  @Post('play/state/:urlCode')
  @ApiOperation({
    summary: 'Create a game state if not exists for play game URL code',
  })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game state created successfully.',
    GameStateResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.CONFLICT,
    'Maximum players limit reached.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while saving game state to the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async createGameStateIfNotExists(
    @Param('urlCode') urlCode: string,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameStateResponseDTO>> {
    this.logger.log(`createGameStateIfNotExists :: urlCode - ${urlCode}`);

    // Call the createGameStateIfNotExists method of the gameService to create a game state if not exists for game URL code (applicable for URL type PLAY_GAME only)
    const responseObj = await this.gameService.createGameStateIfNotExists(
      urlCode,
      req.user,
    );
    this.logger.log(
      `createGameStateIfNotExists :: responseObj - ${JSON.stringify(
        responseObj,
      )}`,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameStateResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game state created successfully.',
      data: responseObj,
    };

    return successResponse;
  }

  /**
   * Handle GET request to fetch an existing game state by play game URL code.
   * @param urlCode The play game URL code of the game state to fetch.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing the fetched game state.
   */
  @Get('play/state/:urlCode')
  @ApiOperation({
    summary: 'Get game state by play game URL code',
  })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game state fetched successfully.',
    GameStateResponseDTO,
  )
  // @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.NOT_FOUND,
    'Game state with given game URL code not found.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while retrieving game state from the database.',
  )
  // @ApiBearerAuth('Bearer')
  // @UseGuards(JwtAuthGuard)
  public async getGameStateByGameUrlCode(
    @Param('urlCode') urlCode: string,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameStateResponseDTO>> {
    this.logger.log(`getGameStateByGameUrlCode :: urlCode - ${urlCode}`);

    // Call the getGameStateByGameUrlCode method of the gameService to fetch the game state by game URL code
    const gameState = await this.gameService.getGameStateByGameUrlCode(
      urlCode,
      req.user,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameStateResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game state fetched successfully.',
      data: gameState,
    };

    return successResponse;
  }
}
