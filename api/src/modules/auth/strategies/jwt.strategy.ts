import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Request } from 'express';
import { IPayload } from 'src/common/interfaces/payload.interface';
import jwtConfig from 'src/config/jwt.config';
import { AuthService } from '../auth.service';

interface RequestWithCookies extends Request {
  cookies: Record<string, string>;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    readonly config: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  async validate(payload: IPayload) {
    return this.authService.validateJwt(payload);
  }

  private static extractJwtFromCookie(
    this: void,
    req: RequestWithCookies,
  ): string | null {
    if (req.cookies && 'jwt' in req.cookies && req.cookies.jwt.length > 0)
      return req.cookies.jwt;

    return null;
  }
}
