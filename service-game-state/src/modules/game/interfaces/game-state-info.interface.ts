import { BaseDocument } from '../../../shared/interfaces/base-document.interface';
import { GameStateConfig } from './game-state-config.interface';
import { PlayerTurn } from './player-turn.interface';

/**
 * Interface for the GameStateInfo model.
 */
export interface GameStateInfo {
  // extends BaseDocument
  readonly game_id: string; // Game ID associated with the GameState
  readonly game_state_config: GameStateConfig;
  readonly owner_user_id: string;
  readonly players_count: number;
  readonly started_at?: number;
  readonly end_date?: number;
  readonly players_turn_sequence?: Array<PlayerTurn>;
}
