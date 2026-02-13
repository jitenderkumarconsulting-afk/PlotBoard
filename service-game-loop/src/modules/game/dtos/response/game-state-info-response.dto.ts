import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { PlayerTurnResponseDTO } from './player-turn-response.dto';
import { GameStateConfigResponseDTO } from './game-state-config-response.dto';

export class GameStateInfoResponseDTO {
  @ApiProperty({
    name: 'game_id',
    type: String,
    description: 'Game id associated with the game token',
    example: '603f650a28a3a47db45bda78',
  })
  game_id: String;

  @ApiProperty({
    name: 'game_state_config',
    type: GameStateConfigResponseDTO,
    description: '',
    example: '{}',
  })
  game_state_config: GameStateConfigResponseDTO;

  @ApiProperty({
    name: 'owner_user_id',
    type: String,
    description: 'User id of the owner of the game token',
    example: '603f650a28a3a47db45bda78',
  })
  owner_user_id: String;

  @ApiProperty({
    name: 'players_count',
    type: Number,
    description: 'Game players count',
    example: 2,
  })
  players_count: Number;

  @ApiPropertyOptional({
    name: 'started_at',
    type: Number,
    description: '',
    example: 1679788800000, // Represents "2023-12-31T00:00:00Z"
  })
  started_at?: Number;

  @ApiPropertyOptional({
    name: 'end_date',
    type: Number,
    description: 'End date of the game in milliseconds (must be in the future)',
    example: 1679788800000, // Represents "2023-12-31T00:00:00Z"
  })
  end_date?: Number;

  @ApiPropertyOptional({
    name: 'players_turn_sequence',
    type: Array,
    description: '',
    example: '[]',
  })
  players_turn_sequence?: Array<PlayerTurnResponseDTO>;
}
