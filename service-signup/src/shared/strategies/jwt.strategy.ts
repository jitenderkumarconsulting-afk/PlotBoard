import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { UserService } from '../../modules/user/services/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger: Logger;
  private readonly jwtAfterExpiredMaxAllowedTime: number;

  constructor(
    private readonly userService: UserService, // Inject UserService
  ) {
    // Call the constructor of the PassportStrategy class with the 'Strategy' parameter
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Get the JWT secret from the environment variable
      ignoreExpiration: true, // We will handle token expiration manually
      passReqToCallback: true, // Pass the request object to the validate callback
    });

    this.logger = new Logger(JwtStrategy.name);

    // Get the JWT Token after expired maximum allowed time from the environment variable and convert it to seconds
    this.jwtAfterExpiredMaxAllowedTime = parseInt(
      process.env.JWT_AFTER_EXPIRED_MAX_ALLOWED_TIME,
      10,
    );
  }

  /**
   * Validate the payload extracted from the JWT.
   * @param req The request object
   * @param payload The decoded JWT payload
   * @returns A Promise that resolves to the validated user data
   */
  public async validate(req: any, payload: any): Promise<any> {
    this.logger.log(`validate :: payload - ${JSON.stringify(payload)}`);

    // Extract relevant data from the JWT payload
    const { sub: userId, email, exp } = payload;

    // Retrieve the user from the userService based on the user ID and email
    const user = await this.userService.getUserByIdAndEmail(userId, email);
    this.logger.log(`validate :: user - ${JSON.stringify(user)}`);

    // If the user is not found, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('User is not authenticated.');
    }

    // Get the 'allowExpiredJwt' flag from the request object, which was set by the JwtAuthGuard
    const allowExpiredJwt = req.allowExpiredJwt;
    this.logger.log(`validate :: allowExpiredJwt - ${allowExpiredJwt}`);

    // Calculate the token expired time in seconds from the current time
    const tokenExpiredTime = Date.now() / 1000 - exp;
    this.logger.log(`validate :: tokenExpiredTime - ${tokenExpiredTime}`);

    if (tokenExpiredTime > 0) {
      // Token has already expired
      this.logger.log('validate :: Token has already expired.');

      if (
        allowExpiredJwt &&
        tokenExpiredTime <= this.jwtAfterExpiredMaxAllowedTime
      ) {
        // Token expired within the allowed time frame, so still validate the user
        this.logger.log(
          'validate :: Token expired within the allowed time frame, so still validate the user.',
        );
        return user;
      } else {
        // Token expired and outside the allowed time frame in case of 'allowExpiredJwt' too, so throw UnauthorizedException
        this.logger.log('validate :: Token expired and access not allowed.');
        throw new UnauthorizedException('Token has expired.');
      }
    }

    // Return the validated user
    return user;
  }
}
