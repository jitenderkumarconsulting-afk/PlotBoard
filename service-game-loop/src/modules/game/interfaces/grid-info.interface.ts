import { BaseDocument } from '../../../shared/interfaces/base-document.interface';

/**
 * Interface for the GridInfo model.
 */
export interface GridInfo {
  // extends BaseDocument
  readonly rows: number;
  readonly columns: number;
}
