import { ApiProperty } from '@nestjs/swagger';

export class PlayerTurnResponseDTO {
  // User id of the player
  @ApiProperty({
    name: 'user_id',
    type: String,
    description: 'User id of the player',
    example: '12345',
  })
  user_id: string;

  @ApiProperty({
    name: 'name',
    type: String,
    description: 'Name of the player',
    example: 'John',
  })
  name: String;

  @ApiProperty({
    name: 'is_anonymous',
    type: Boolean,
    description: 'Player is registered or anonymous',
    example: false,
  })
  is_anonymous: Boolean;

  @ApiProperty({
    name: 'player_num',
    type: Number,
    description: 'Player number',
    example: 1,
  })
  player_num: number;
}
