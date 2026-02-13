import { BaseDocument } from '../../../shared/interfaces/base-document.interface';

/**
 * Interface for the PlayerTurn model.
 */
export interface PlayerTurn {
  // extends BaseDocument
  readonly user_id: string;
  readonly name: string;
  readonly is_anonymous: boolean;
  readonly player_num: number;
}
