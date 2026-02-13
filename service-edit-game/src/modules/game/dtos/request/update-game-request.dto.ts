import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Length,
  IsObject,
} from 'class-validator';

import { BaseRequestDTO } from '../../../../shared/dtos/request/base/base-request.dto';

export class UpdateGameRequestDTO extends BaseRequestDTO {
  // Name property (optional)
  @ApiPropertyOptional({
    name: 'name',
    type: String,
    description: 'Name of the game',
    example: 'My Awesome Game',
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name is required.' }) // The name field must not be empty
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters.' }) // Validate the length of the name field
  readonly name?: string;

  // Description property (optional)
  @ApiPropertyOptional({
    name: 'description',
    type: String,
    description: 'Description of the game',
    example: 'An exciting adventure game',
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(500, {
    message: 'Description cannot exceed 500 characters.',
  })
  readonly description?: string;

  // Original image URL property (optional)
  @ApiPropertyOptional({
    name: 'original_image_url',
    type: String,
    description: 'URL of the original image associated with the game',
    example: 'https://example.com/images/game-original.png',
  })
  @IsOptional()
  @IsString({ message: 'Original image URL must be a string.' })
  @MaxLength(256, {
    message: 'Original image URL cannot exceed 256 characters.',
  })
  @Matches(/\.(png|jpe?g|gif|bmp|webp|svg)$/i, {
    message: 'Original image URL must point to a valid image resource.',
  })
  readonly original_image_url?: string;

  // Thumbnail image URL property (optional)
  @ApiPropertyOptional({
    name: 'thumbnail_image_url',
    type: String,
    description: 'URL of the thumbnail image associated with the game',
    example: 'https://example.com/images/game-thumbnail.png',
  })
  @IsOptional()
  @IsString({ message: 'Thumbnail image URL must be a string.' })
  @MaxLength(256, {
    message: 'Thumbnail image URL cannot exceed 256 characters.',
  })
  @Matches(/\.(png|jpe?g|gif|bmp|webp|svg)$/i, {
    message: 'Thumbnail image URL must point to a valid image resource.',
  })
  readonly thumbnail_image_url?: string;

  // Game script property (optional)
  @ApiPropertyOptional({
    name: 'game_script',
    type: Object,
    description: 'JSON object representing the game script',
    example: '{"level": 1, "score": 100}',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Game script is required.' })
  @IsObject({ message: 'Game script must be a valid JSON object.' })
  readonly game_script?: Record<string, any>;
}
