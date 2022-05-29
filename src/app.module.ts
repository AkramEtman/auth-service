import { CacheModule, Inject, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { SessionsModule } from './sessions/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        SESSION_SECRET: Joi.string().required()
      })
    }),
    // CachingModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    SessionsModule
  ]
})

export class AppModule {}
