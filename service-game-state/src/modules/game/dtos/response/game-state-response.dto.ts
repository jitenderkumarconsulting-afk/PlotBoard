import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GameStatePlayerResponseDTO } from './game-state-player-response.dto';
import { GameStateInfoResponseDTO } from './game-state-info-response.dto';
import { PlayerTurnResponseDTO } from './player-turn-response.dto';
import { GameStateResultResponseDTO } from './game-state-result-response.dto';

export class GameStateResponseDTO {
  @ApiProperty({
    name: 'game_token',
    type: String,
    description: 'Alphanumeric code for the play game URL',
    example: 'abc123',
  })
  game_token: String;

  // JSON object representing the game state script
  @ApiProperty({
    name: 'game_state_script',
    type: Object,
    description: 'JSON object representing the game state script',
    example: '{"level": 1, "score": 100}',
  })
  game_state_script: Record<string, any>;

  @ApiProperty({
    name: 'game_state_info',
    type: GameStateInfoResponseDTO,
    description: '',
    example: '{}',
  })
  game_state_info: GameStateInfoResponseDTO;

  @ApiProperty({
    name: 'load_run_info',
    type: Object,
    description: '',
    example: '',
  })
  load_run_info: Record<string, any>;

  @ApiProperty({
    name: 'end_run_info',
    type: Object,
    description: '',
    example: '',
  })
  end_run_info: Record<string, any>;

  @ApiProperty({
    name: 'players',
    type: Array,
    description: '',
    example: '[]',
  })
  players: Array<GameStatePlayerResponseDTO>;

  @ApiProperty({
    name: 'captured_objects',
    type: Array,
    description: '',
    example: '[]',
  })
  captured_objects: Array<Record<string, any>>;

  @ApiPropertyOptional({
    name: 'current_turn',
    type: PlayerTurnResponseDTO,
    description: 'Current player turn',
    example: '{}',
  })
  current_turn?: PlayerTurnResponseDTO;

  @ApiProperty({
    name: 'game_state_result',
    type: GameStateResultResponseDTO,
    description: 'Game state result',
    example: {},
  })
  game_state_result: GameStateResultResponseDTO;
}
