import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        'RbH1iNkz56KiEy4m5Lfn18QYAH5wvIr9LjNKNaaZce94YMYfrSiYeDfgMMZZ5W9c',
    });
  }

  validate(payload: JwtPayload) {
    return { userId: payload.sub, role: payload.role, name: payload.name };
  }
}

interface JwtPayload {
  sub: string;
  role: string;
  name: string;
}
