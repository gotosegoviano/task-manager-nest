import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'EstaEsUnaClaveUltaSecreta1234',
    });
  }

  /**
   * Validates the JWT payload and returns the user's information.
   * @param payload - The JWT payload containing user information.
   * @returns An object with userId, email, and role extracted from the payload.
   */
  validate(payload: any) {
    // El payload contiene los datos del token
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
