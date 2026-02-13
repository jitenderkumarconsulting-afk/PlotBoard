import { BaseDocument } from '../../../shared/interfaces/base-document.interface';

/**
 * Interface for the GameStateResultPlayer model.
 */
export interface GameStateResultPlayer {
  // extends BaseDocument
  readonly user_id: string;
  readonly name: string;
  readonly is_anonymous: boolean;
  readonly points: number;
  readonly message: string;
}
