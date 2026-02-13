import { BaseDocument } from '../../../shared/interfaces/base-document.interface';
import { GameUrlType } from '../enums/game-url-type.enum';

/**
 * Interface for the GameUrl model.
 */
export interface GameUrl extends BaseDocument {
  readonly user_id: string; // User ID associated with the GameUrl
  readonly game_id: string; // Game ID associated with the GameUrl
  readonly url_type: GameUrlType; // Type of the URL (enum from GameUrlType)
  readonly url_code: string; // Alphanumeric code for the URL
  readonly shared_with_all_users: boolean; // Flag indicating if the URL is shared with all users
  readonly shared_with_user_ids: string[]; // Array of User IDs the URL is shared with
  readonly expiration_date?: Date; // Expiration date of the URL (optional and must be in the future)
}
