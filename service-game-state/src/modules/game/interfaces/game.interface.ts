import { BaseDocument } from '../../../shared/interfaces/base-document.interface';
import { GameVisibility } from '../enums/game-visibility.enum';

/**
 * Interface for the Game model.
 */
export interface Game extends BaseDocument {
  readonly user_id: string; // User ID associated with the email
  readonly name: string; // Name of the game
  readonly description: string; // Description of the game
  readonly original_image_url: string; // URL of the original image associated with the game
  readonly thumbnail_image_url: string; // URL of the thumbnail image associated with the game
  readonly game_script: Record<string, any>; // JSON object representing the game script
  readonly visibility: GameVisibility; // Visibility of the game (public or private)
}
