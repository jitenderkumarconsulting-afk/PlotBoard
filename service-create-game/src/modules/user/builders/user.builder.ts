import { Injectable, Logger } from '@nestjs/common';

import { User } from '../../user/interfaces/user.interface';

@Injectable()
export class UserBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(UserBuilder.name);
  }
}
