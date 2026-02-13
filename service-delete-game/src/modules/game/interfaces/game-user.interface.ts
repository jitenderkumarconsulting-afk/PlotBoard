import { BaseDocument } from '../../../shared/interfaces/base-document.interface';
import { GameUserRole } from '../enums/game-user-role.enum';

/**
 * Interface for the GameUser model.
 */
export interface GameUser extends BaseDocument {
  readonly user_id: string; // User ID associated with the UserGame
  readonly game_id: string; // Game ID associated with the UserGame
  readonly role: GameUserRole; // Role of the user in the game (enum from GameUserRole)
}
