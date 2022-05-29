import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { User, UserDocument } from '../entities/user.entity';
import { SessionsService } from '../../sessions/services/session.service';
import { UpdateUserDto } from '../dto/update-user.dto';


@Injectable()
export class UsersService {

  SALT_Rounds = 10;

  constructor(
    @InjectModel(User.name) private readonly userModel: mongoose.Model<UserDocument>,
    private readonly sessionsService: SessionsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userDto } =createUserDto;
    const hashedPassword = await bcrypt.hash(password, this.SALT_Rounds);
    
    try{
      let user = await this.userModel.create({
        email: userDto.email?.trim().toLowerCase(),
        username: userDto.username.trim(),
        password: hashedPassword,
        role: userDto.role
      })

      this.sessionsService.create( user )
    }catch(err:any){
      let failedAttributes = Object.keys( err.keyValue ) 
      throw new BadRequestException("Bad Inputs for " + failedAttributes.toString() )
    }
  }

  async update(id:string, updateUserDto: UpdateUserDto ){
    let user = await this.findOne( id )

    try{
      let updatedUser:User = await this.userModel.findOneAndUpdate( 
        { _id: user._id },
        updateUserDto,
        { new: true }
      ).exec();  
      await this.sessionsService.update( updatedUser )
    }catch(err:any){
      let failedAttributes = Object.keys( err.keyValue ) 
      throw new BadRequestException("Bad Inputs for " + failedAttributes.toString() )
    }
  }

  async findOneByEmail(email:string){
    const user =  await this.userModel.findOne({
      email: email
    }).exec();

    if( !user ){ throw new NotFoundException() }
    return user
  }

  async findOne(id:string){
    let userId = new mongoose.Types.ObjectId(id)
    const user =  await this.userModel.findOne({
      _id: userId
    }).exec();
    
    if( !user ){ throw new NotFoundException() }
    return user
  }

}
