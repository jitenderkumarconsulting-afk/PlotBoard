import { BaseDocument } from '../../../shared/interfaces/base-document.interface';
import GameStateResultType from '../enums/game-state-result-type.enum';
import { GameStateResultPlayer } from './game-state-result-player.interface';

/**
 * Interface for the GameStateResult model.
 */
export interface GameStateResult {
  // extends BaseDocument
  readonly players: Array<GameStateResultPlayer>; // An array of all players who participated in the game except winner.
  readonly result_type: GameStateResultType; // The type of result for the game, using the GameStateResultType enum.
  readonly message: string; // A message describing the game result message for all players except for the winner.
  readonly matched_win_item?: Record<string, any>; // Optional: The matched win item from the game's script, indicating the specifics of the winning condition.
  readonly matched_win_run_info?: Record<string, any>;
  readonly winner?: GameStateResultPlayer; // Optional: Player who won the game.
  readonly winner_message?: string; // Optional: Message specific to the game winner.
  readonly loser_message?: string; // Optional: Message specific to the game losers.
}
