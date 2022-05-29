import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './services/cache.service';

@Module({
    imports: [
      CacheModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            store: redisStore,
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          }),
      }),  
    ],
    providers:[ CacheService ],
    exports:[ CacheService ]
  })
  export class CachingModule {}