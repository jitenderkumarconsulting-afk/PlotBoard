import {
  Controller,
  Request,
  UseGuards,
  Logger,
  Param,
  Get,
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
import { ListResponseDTO } from '../../../shared/dtos/response/list-response.dto';

@Controller('games')
@ApiTags('Games')
@ApiExtraModels(
  SuccessResponseEnvelopeDTO,
  ErrorResponseEnvelopeDTO,
  ListResponseDTO,
  GameResponseDTO,
)
export class GameController {
  private readonly logger: Logger;

  constructor(private readonly gameService: GameService) {
    this.logger = new Logger(GameController.name);
  }

  /**
   * Handle GET request to fetch all existing games of the authenticated user.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing the list of games.
   */
  @Get()
  @ApiOperation({ summary: 'Get all games of the authenticated user' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Games fetched successfully.',
    ListResponseDTO<GameResponseDTO>, // ListResponseDTO containing the list of GameResponseDTO
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while fetching all games from the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async getAllGames(
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<ListResponseDTO<GameResponseDTO>>> {
    this.logger.log(`getAllGames :: req.user - ${JSON.stringify(req.user)}`);

    // Call the getAllGames method of the gameService to fetch all games
    const listResponse = await this.gameService.getAllGames(req.user);

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<
      ListResponseDTO<GameResponseDTO>
    > = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Games fetched successfully.',
      data: listResponse,
    };

    return successResponse;
  }

  /**
   * Handle GET request to fetch an existing game by ID.
   * @param gameId The ID of the game to fetch.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing the fetched game.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get game by ID' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game fetched successfully.',
    GameResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.NOT_FOUND,
    'Game with given ID not found.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while fetching game by ID from the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async getGameById(
    @Param('id') gameId: string,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameResponseDTO>> {
    this.logger.log(`getGameById :: gameId - ${gameId}`);

    // Call the getGameById method of the gameService to fetch the game by ID
    const game = await this.gameService.getGameById(gameId, req.user);

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game fetched successfully.',
      data: game,
    };

    return successResponse;
  }
}
