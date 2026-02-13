import {
  Controller,
  Request,
  UseGuards,
  Logger,
  Param,
  Delete,
  Get,
  Post,
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
import { GameService } from '../services/game.service';
import { GameUrlResponseDTO } from '../dtos/response/game-url-response.dto';
import { ListResponseDTO } from '../../../shared/dtos/response/list-response.dto';
import { CreateGameUrlRequestDTO } from '../dtos/request/create-game-url-request.dto';
import { GameResponseDTO } from '../dtos/response/game-response.dto';

@Controller('games')
@ApiTags('Games')
@ApiExtraModels(
  SuccessResponseEnvelopeDTO,
  ErrorResponseEnvelopeDTO,
  ListResponseDTO,
  GameUrlResponseDTO,
  GameResponseDTO,
)
export class GameController {
  private readonly logger: Logger;

  constructor(private readonly gameService: GameService) {
    this.logger = new Logger(GameController.name);
  }

  /**
   * Handle POST request to create a new game URL.
   * @param createGameUrlRequestDTO The DTO containing the request data for creating a game URL.
   * @param gameId The ID of the game to which the URL will be associated.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing the created game URL.
   */
  @Post(':gameId/urls')
  @ApiOperation({ summary: 'Create Game URL' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game URL created successfully.',
    GameUrlResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.BAD_REQUEST,
    'Invalid request. Please check the request body for errors.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while saving game URL to the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async createGameUrl(
    @Body() createGameUrlRequestDTO: CreateGameUrlRequestDTO,
    @Param('gameId') gameId: string,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameUrlResponseDTO>> {
    this.logger.log(
      `createGameUrl :: createGameUrlRequestDTO - ${JSON.stringify(
        createGameUrlRequestDTO,
      )}`,
    );

    // Call the createGameUrlRequest method of the gameService to create a new game URL
    const responseObj = await this.gameService.createGameUrlRequest(
      createGameUrlRequestDTO,
      gameId,
      req.user,
    );
    this.logger.log(
      `createGameUrl :: responseObj - ${JSON.stringify(responseObj)}`,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameUrlResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game URL created successfully.',
      data: responseObj,
    };

    return successResponse;
  }

  /**
   * Fetch all game URLs for a specific game.
   * @param gameId The ID of the game to fetch game URLs.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing an array of game URLs for the specific game.
   */
  @Get(':gameId/urls')
  @ApiOperation({ summary: 'Fetch all game URLs for a specific game' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Games URLs for the game fetched successfully.',
    ListResponseDTO<GameUrlResponseDTO>,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.NOT_FOUND,
    'Game with given ID not found.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while fetching all game URLs from the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async getAllGameUrlsForGame(
    @Param('gameId') gameId: string,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<ListResponseDTO<GameUrlResponseDTO>>> {
    this.logger.log(`getAllGameUrlsForGame :: gameId - ${gameId}`);

    // Call the getAllGameUrlsForGame method of the gameService to fetch all game URLs for the specific game
    const gameUrls = await this.gameService.getAllGameUrlsForGame(
      gameId,
      req.user,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<
      ListResponseDTO<GameUrlResponseDTO>
    > = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game URLs for the game fetched successfully.',
      data: gameUrls,
    };

    return successResponse;
  }

  /**
   * Handle DELETE request to delete an existing game URL by ID.
   * @param gameId The ID of the game.
   * @param gameUrlId The ID of the game URL to delete.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing the deleted game URL.
   */
  @Delete(':gameId/urls/:gameUrlId')
  @ApiOperation({ summary: 'Delete game URL by ID' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game URL deleted successfully.',
    GameUrlResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.NOT_FOUND,
    'Game URL with given ID not found.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while deleting game URL from the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async deleteGameUrl(
    @Param('gameId') gameId: string,
    @Param('gameUrlId') gameUrlId: string,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameUrlResponseDTO>> {
    this.logger.log(
      `deleteGameUrl :: gameId - ${gameId}, gameUrlId - ${gameUrlId}`,
    );

    // Call the deleteGameUrlRequest method of the gameService to delete the game URL by ID
    const game = await this.gameService.deleteGameUrlRequest(
      gameUrlId,
      gameId,
      req.user,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameUrlResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game URL deleted successfully.',
      data: game,
    };

    return successResponse;
  }

  /**
   * Perform a game URL code action.
   * This API allows performing actions based on a game URL code and returns a response with game details.
   * @param urlCode The code associated with the game URL.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing the result of the action and game details.
   */
  @Post('actions/url-code/:urlCode')
  @ApiOperation({ summary: 'Perform game URL code action' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game URL code action performed successfully.',
    GameUrlResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.BAD_REQUEST,
    'Invalid request. Please check the request body for errors.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.NOT_FOUND,
    'Game URL with given code not found.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while processing the request.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async performGameUrlCodeAction(
    @Param('urlCode') urlCode: string,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameUrlResponseDTO>> {
    this.logger.log(`performGameUrlCodeAction :: urlCode - ${urlCode}`);

    // Call the appropriate method of the gameService to perform action based on the URL code
    const responseObj = await this.gameService.performGameUrlCodeAction(
      urlCode,
      req.user,
    );
    this.logger.log(
      `performGameUrlCodeAction :: responseObj - ${JSON.stringify(
        responseObj,
      )}`,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameUrlResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game URL code action performed successfully.',
      data: responseObj,
    };

    return successResponse;
  }
}
