import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GridInfoResponseDTO } from './grid-info-response.dto';

export class GameStateConfigResponseDTO {
  @ApiProperty({
    name: 'grid_info',
    type: GridInfoResponseDTO,
    description: '',
    example: '{}',
  })
  grid_info: GridInfoResponseDTO;

  @ApiProperty({
    name: 'description',
    type: String,
    description: '',
    example: 'Game script description',
  })
  description: String;

  @ApiProperty({
    name: 'max_players',
    type: Number,
    description: '',
    example: 2,
  })
  max_players: Number;

  @ApiPropertyOptional({
    name: 'game_duration',
    type: Number,
    description: '',
    example: 60000,
  })
  game_duration?: Number;

  @ApiPropertyOptional({
    name: 'turn_duration',
    type: Number,
    description: '',
    example: 60,
  })
  turn_duration?: Number;
}
