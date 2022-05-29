import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionsService } from 'src/sessions/services/session.service';
import { ITokenPayload } from 'src/users/dto/user-token-Payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly sessionsService: SessionsService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate(payload: ITokenPayload): Promise<any>  {
    let isAuth = await this.sessionsService.IsLoggedIn( payload.user._id )
    if(!isAuth){return false}
    let userSession = await this.sessionsService.findOne( payload.user._id )
    return userSession
  }
}
