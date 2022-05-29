import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';
import { SessionsService } from '../../sessions/services/session.service';
import { ITokenPayload } from '../../users/dto/user-token-Payload';
import mongoose from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    let user:User = await this.usersService.findOneByEmail(email);
    let isValid = await this.verifyPassword(plainTextPassword, user.password);

    if( isValid){
      user.password = undefined
      return user;
    }
    
    return null;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) { return false }
    return true
  }

  async login(user: any) {
    const payload:ITokenPayload = { 
      user:{
        _id: user._id
      }
    };
    this.sessionsService.create( user )
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(id: any) {
    if( !mongoose.Types.ObjectId.isValid( id ) ){
      throw new BadRequestException("User ID must be valid")
    }
    let userId = new mongoose.Types.ObjectId(id) 
    this.sessionsService.deleteOne( userId )
  }
}
