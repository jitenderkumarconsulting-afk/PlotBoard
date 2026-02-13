import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GameStateResultPlayerResponseDTO } from './game-state-result-player-response.dto';
import GameStateResultType from '../../enums/game-state-result-type.enum';

export class GameStateResultResponseDTO {
  @ApiProperty({
    name: 'players',
    type: Array,
    description: '',
    example: '[]',
  })
  players: Array<GameStateResultPlayerResponseDTO>;

  @ApiProperty({
    name: 'result_type',
    type: String,
    description: '',
    enum: GameStateResultType,
    example: '',
  })
  result_type: GameStateResultType;

  @ApiProperty({
    name: 'message',
    type: String,
    description: '',
    example: '',
  })
  message: String;

  @ApiPropertyOptional({
    name: 'matched_win_item',
    type: Object,
    description: '',
    example: '',
  })
  matched_win_item?: Record<string, any>;

  @ApiPropertyOptional({
    name: 'matched_win_run_info',
    type: Object,
    description: '',
    example: '',
  })
  matched_win_run_info?: Record<string, any>;

  @ApiPropertyOptional({
    name: 'winner',
    type: GameStateResultPlayerResponseDTO,
    description: '',
    example: '',
  })
  winner?: GameStateResultPlayerResponseDTO;

  @ApiPropertyOptional({
    name: 'winner_message',
    type: String,
    description: '',
    example: '',
  })
  winner_message?: String;

  @ApiPropertyOptional({
    name: 'loser_message',
    type: String,
    description: '',
    example: '',
  })
  loser_message?: String;
}
