import { SetMetadata } from '@nestjs/common';

export const AllowExpiredJwt = () => SetMetadata('allowExpiredJwt', true);
