import { BaseDocument } from '../../../shared/interfaces/base-document.interface';
import { GridInfo } from './grid-info.interface';

/**
 * Interface for the GameStateConfig model.
 */
export interface GameStateConfig {
  // extends BaseDocument
  readonly grid_info: GridInfo;
  readonly description: string;
  readonly max_players: number;
  readonly game_duration?: number;
  readonly turn_duration?: number;
}
