import { ApiProperty } from '@nestjs/swagger';

import { PositionResponseDTO } from './position-response.dto';

export class EventPossibleMovesResponseDTO {
  @ApiProperty({
    name: 'ObjectID',
    type: String,
    description: '',
    example: '',
  })
  ObjectID: string;

  @ApiProperty({
    name: 'possible_moves',
    type: Array<PositionResponseDTO>,
    description: '',
    example: '',
  })
  possible_moves: Array<PositionResponseDTO>;
}
