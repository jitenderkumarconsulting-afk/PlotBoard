import { ApiProperty } from '@nestjs/swagger';

import { GameStateResultResponseDTO } from './game-state-result-response.dto';

export class EventEndResponseDTO {
  @ApiProperty({
    name: 'end_run_info',
    type: Object,
    description: '',
    example: '',
  })
  end_run_info: Record<string, any>;

  @ApiProperty({
    name: 'game_state_result',
    type: GameStateResultResponseDTO,
    description: '',
    example: '',
  })
  game_state_result: GameStateResultResponseDTO;
}
