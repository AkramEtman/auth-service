import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { SessionsModule } from 'src/sessions/session.module';
import { UsersController } from './controllers/users.controller';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './services/users.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    SessionsModule,
    ConfigModule
  ],
  controllers:[UsersController],
  providers: [UsersService,JwtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
