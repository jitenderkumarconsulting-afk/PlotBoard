import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { GameVisibility } from '../../enums/game-visibility.enum';

export class GameResponseDTO {
  // Unique identifier of the game
  @ApiProperty({
    name: 'id',
    type: String,
    description: 'Unique identifier of the game',
    example: '603f650a28a3a47db45bda78',
  })
  id: string;

  // User ID associated with the game
  @ApiProperty({
    name: 'user_id',
    type: String,
    description: 'User ID associated with the game',
    example: '604af7b7cfb4b3001f27d9db',
  })
  user_id: string;

  // Name of the game
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'Name of the game',
    example: 'My Awesome Game',
  })
  name: string;

  // Description of the game
  @ApiPropertyOptional({
    name: 'description',
    type: String,
    description: 'Description of the game',
    example: 'An exciting adventure game',
  })
  description?: string;

  // URL of the original image associated with the game
  @ApiPropertyOptional({
    name: 'original_image_url',
    type: String,
    description: 'URL of the original image associated with the game',
    example: 'https://example.com/images/game-original.png',
  })
  original_image_url?: string;

  // URL of the thumbnail image associated with the game
  @ApiPropertyOptional({
    name: 'thumbnail_image_url',
    type: String,
    description: 'URL of the thumbnail image associated with the game',
    example: 'https://example.com/images/game-thumbnail.png',
  })
  thumbnail_image_url?: string;

  // JSON object representing the game script
  @ApiProperty({
    name: 'game_script',
    type: Object,
    description: 'JSON object representing the game script',
    example: '{"level": 1, "score": 100}',
  })
  game_script?: Record<string, any>;

  // Visibility of the game
  @ApiProperty({
    name: 'visibility',
    type: String,
    description: 'Visibility of the game',
    enum: GameVisibility,
    example: 'PUBLIC',
  })
  visibility: GameVisibility;
}
