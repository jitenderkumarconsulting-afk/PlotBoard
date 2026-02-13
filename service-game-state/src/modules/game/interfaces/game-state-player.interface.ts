import { BaseDocument } from '../../../shared/interfaces/base-document.interface';

/**
 * Interface for the GameStatePlayer model.
 */
export interface GameStatePlayer {
  // extends BaseDocument
  readonly user_id: string;
  readonly name: string;
  readonly is_anonymous: boolean;
  readonly points: number;
}
