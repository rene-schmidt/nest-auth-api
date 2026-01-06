import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT authentication strategy.
 *
 * Validates incoming JWT access tokens and attaches
 * the authenticated user information to the request object.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      // Extract JWT from the Authorization header (Bearer <token>)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Secret used to verify the access token signature
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  /**
   * Validates the decoded JWT payload.
   *
   * The returned object will be attached to `req.user`
   * and can be accessed in controllers and guards.
   *
   * @param payload Decoded JWT payload
   * @returns Authenticated user data
   */
  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
