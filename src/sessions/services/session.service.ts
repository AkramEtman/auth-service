import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { CacheService } from '../../cache/services/cache.service';
import { User } from '../../users/entities/user.entity';
import { IUserSession } from '../dto/userSession.dto';

@Injectable()
export class SessionsService {

  constructor(
	  private readonly cacheService: CacheService
	){}

	private BASE_KEY = "session:"
	getUserSessionCacheKey( userId:mongoose.Types.ObjectId ){
		return this.BASE_KEY + userId.toString()
	}

	async create( user:User ) {
		let userSession = this.buildUserSession( user )
		let userSessionKey = this.getUserSessionCacheKey( user._id )
		await this.setSession( userSessionKey, userSession )
	}

	async update(user:User ){
		let userSession = this.buildUserSession( user )
		let userSessionKey = this.getUserSessionCacheKey( user._id )
		await this.setSession( userSessionKey, userSession )
  }

  async findOne(userId:mongoose.Types.ObjectId):Promise<IUserSession>{
		let userSessionKey = this.getUserSessionCacheKey( userId )
		let userSession = await this.getSession( userSessionKey )
		return userSession
	}

  async deleteOne(userId:mongoose.Types.ObjectId){
		let userSessionKey = this.getUserSessionCacheKey( userId )
		await this.deleteSession( userSessionKey )
  }
	
  async IsLoggedIn(userId:mongoose.Types.ObjectId){
		let userSessionKey = this.getUserSessionCacheKey( userId )
		let userSession =  await this.getSession(userSessionKey )
		return userSession != null
	}

	async setSession(userSessionKey:string, userSession:IUserSession) {
		//todo handle set options like ttl
		await this.cacheService.set(userSessionKey, userSession )
	}

	async getSession(userSessionKey:string ):Promise<any> {
		return this.cacheService.get(userSessionKey)
	}

	async deleteSession(userSessionKey:string ) {
		await this.cacheService.del(userSessionKey)
	}

	buildUserSession( user:User ):IUserSession{
		return {
			_id: user._id,
			role: user.role,
			username: user.username
		}
	}
}
