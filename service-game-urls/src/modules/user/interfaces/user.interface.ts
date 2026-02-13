import { BaseDocument } from '../../../shared/interfaces/base-document.interface';

export interface User extends BaseDocument {
  readonly username: string; // Username of the user
  readonly password: string; // Password of the user
  readonly name: string; // Full name of the user
  readonly email: string; // Email address of the user
  readonly phone: string; // Phone number of the user
  readonly country: string; // Country of the user
}
