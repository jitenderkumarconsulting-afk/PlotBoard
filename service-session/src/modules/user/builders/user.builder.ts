import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserBuilder {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(UserBuilder.name);
  }
}
