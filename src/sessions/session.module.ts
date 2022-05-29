import { CacheModule, Module } from '@nestjs/common';
import { SessionsService } from './services/session.service';
import { CachingModule } from 'src/cache/cache.module';

@Module({
  imports:[
    CachingModule
  ],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}