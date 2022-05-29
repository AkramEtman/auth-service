import { CACHE_MANAGER, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {

  constructor(
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	async set( key:string, value:any, options?:any) {
		//todo improve set options
		return this.cacheManager.set(key, value, { ttl: 0 } )
	}

	async get( key:string ) {
		return this.cacheManager.get(key)
	}

	async del( key:string ) {
		return this.cacheManager.del(key)
	}

}
