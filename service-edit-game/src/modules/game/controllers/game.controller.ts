import {
  Controller,
  Post,
  Request,
  UseGuards,
  Logger,
  Body,
  Patch,
  Param,
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
import { UpdateGameRequestDTO } from '../dtos/request/update-game-request.dto';

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

  // Handle POST request to update an existing game
  @Patch(':id')
  @ApiOperation({ summary: 'Create Game' })
  @ApiSuccessResponseWithEnvelope(
    HttpStatusCodes.OK,
    'Game updated successfully.',
    GameResponseDTO,
  )
  @ApiErrorResponseWithEnvelope(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized')
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.BAD_REQUEST,
    'Invalid request. Please check the request body for errors.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.NOT_FOUND,
    'Game with given ID not found.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.CONFLICT,
    'Game with the same name already exists.',
  )
  @ApiErrorResponseWithEnvelope(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    'Error while updating game to the database.',
  )
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  public async updateGame(
    @Param('id') gameId: string,
    @Body() updateGameRequestDTO: UpdateGameRequestDTO,
    @Request() req,
  ): Promise<SuccessResponseEnvelopeDTO<GameResponseDTO>> {
    this.logger.log(
      `updateGame :: updateGameRequestDTO - ${JSON.stringify(
        updateGameRequestDTO,
      )}`,
    );

    // Call the updateGameRequest method of the gameService to update an existing game
    const responseObj = await this.gameService.updateGameRequest(
      gameId,
      updateGameRequestDTO,
      req.user,
    );
    this.logger.log(
      `updateGame :: responseObj - ${JSON.stringify(responseObj)}`,
    );

    // Prepare the success response
    const successResponse: SuccessResponseEnvelopeDTO<GameResponseDTO> = {
      status_code: HttpStatusCodes.OK,
      success: true,
      message: 'Game updated successfully.',
      data: responseObj,
    };

    return successResponse;
  }
}
