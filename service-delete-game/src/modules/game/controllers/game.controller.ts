import {
  Controller,
  Request,
  UseGuards,
  Logger,
  Param,
  Delete,
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

  /**
   * Handle DELETE request to delete an existing game by ID.
   * @param gameId The ID of the game to delete.
   * @param req The request object containing the authenticated user.
   * @returns A success response containing the deleted game.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete game by ID' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game deleted successfully.',
    GameResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.NOT_FOUND,
    'Game with given ID not found.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while deleting game from the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async deleteGame(
    @Param('id') gameId: string,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameResponseDTO>> {
    this.logger.log(`deleteGame :: gameId - ${gameId}`);

    // Call the deleteGameRequest method of the gameService to delete the game by ID
    const game = await this.gameService.deleteGameRequest(gameId, req.user);

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game deleted successfully.',
      data: game,
    };

    return successResponse;
  }
}
