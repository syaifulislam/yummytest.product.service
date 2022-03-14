import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersRole } from '../decorator/roles.decorator';
const configService = new ConfigService();

export interface AuthTokenUser {
  id: string;
  fullname: string;
  username: string;
  roles: UsersRole;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET_KEY')
    });
  }

  async validate(payload: any): Promise<AuthTokenUser> {
    return { 
      id: payload.id,
      fullname: payload.fullname,
      username: payload.username,
      roles: payload.roles,
    };
  }
}