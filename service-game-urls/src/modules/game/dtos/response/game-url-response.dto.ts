import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GameUrlType } from '../../enums/game-url-type.enum';
import { GameResponseDTO } from './game-response.dto';

export class GameUrlResponseDTO {
  @ApiProperty({
    name: 'id',
    type: String,
    description: 'Unique identifier of the game URL',
    example: '603f650a28a3a47db45bda78',
  })
  id: String;

  @ApiProperty({
    name: 'user_id',
    type: String,
    description: 'User ID associated with the game URL',
    example: '604af7b7cfb4b3001f27d9db',
  })
  user_id: String;

  @ApiProperty({
    name: 'game_id',
    type: String,
    description: 'Game ID associated with the game URL',
    example: '603f650a28a3a47db45bda78',
  })
  game_id: String;

  @ApiProperty({
    name: 'url_type',
    type: String,
    description: 'Type of the URL',
    enum: GameUrlType,
    example: 'PLAY_GAME',
  })
  url_type: GameUrlType;

  @ApiProperty({
    name: 'url_code',
    type: String,
    description: 'Alphanumeric code for the URL',
    example: 'abc123',
  })
  url_code: String;

  @ApiProperty({
    name: 'shared_with_all_users',
    type: Boolean,
    description: 'Flag indicating if the URL is shared with all users',
    example: true,
  })
  shared_with_all_users: Boolean;

  @ApiProperty({
    name: 'shared_with_user_ids',
    type: [String],
    description: 'Array of User IDs the URL is shared with',
    example: ['604af7b7cfb4b3001f27d9db'],
  })
  shared_with_user_ids: Array<string>;

  @ApiPropertyOptional({
    name: 'expiration_date',
    type: Number,
    description:
      'Expiration date of the URL in milliseconds (optional and must be in the future)',
    example: 1679788800000, // Represents "2023-12-31T00:00:00Z"
  })
  expiration_date?: Number;

  // Associated game data
  @ApiProperty({
    name: 'game',
    type: GameResponseDTO,
    description: 'Associated game data',
    example: 'PUBLIC',
  })
  game?: GameResponseDTO;
}
