import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
  IsMongoId,
} from 'class-validator';

import { BaseRequestDTO } from '../../../../shared/dtos/request/base/base-request.dto';
import { GameUrlType } from '../../enums/game-url-type.enum';

export class CreateGameUrlRequestDTO extends BaseRequestDTO {
  // URL type property (optional)
  @ApiProperty({
    name: 'url_type',
    type: String,
    description: 'URL type of the game',
    enum: GameUrlType,
    example: 'PLAY_GAME',
  })
  @IsNotEmpty({ message: 'URL type is required.' })
  @IsEnum(GameUrlType, { message: 'Invalid URL type value.' })
  readonly url_type: GameUrlType;

  // Shared with all users property
  @ApiProperty({
    name: 'shared_with_all_users',
    type: Boolean,
    description: 'Flag indicating whether the URL is shared with all users',
    example: true,
  })
  @IsNotEmpty({ message: 'Shared with all users flag is required.' })
  @IsBoolean({ message: 'Shared with all users flag must be a boolean value.' })
  readonly shared_with_all_users: boolean;

  // Shared with user IDs property (optional)
  @ApiPropertyOptional({
    name: 'shared_with_user_ids',
    type: [String],
    description: 'Array of user IDs with whom the URL is shared',
    example: ['user-id-1', 'user-id-2'],
  })
  @IsOptional()
  @IsArray({ message: 'Shared with user IDs must be an array.' })
  @IsMongoId({
    each: true, // Apply the validator to each element in the array
    message: 'Each value in shared_with_user_ids must be a valid ObjectId.',
  })
  readonly shared_with_user_ids?: Array<string>;

  // Expiration date property (optional)
  @ApiPropertyOptional({
    name: 'expiration_date',
    type: Number,
    description: 'Expiration date of the URL in milliseconds',
    example: 1679788800000, // Represents "2023-12-31T00:00:00Z"
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Expiration date is required.' })
  @IsNumber({}, { message: 'Expiration date must be a valid number.' })
  @Min(Date.now(), { message: 'Expiration date must be in the future.' })
  readonly expiration_date?: number;
}
