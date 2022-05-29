import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Role } from 'src/auth/enums/role.enum';


export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  
  _id:mongoose.Types.ObjectId

  @Prop({ required: true })
  username: string;

  @Prop({  
		required: true,
    unique: true
  })
  email: string;

	@Prop({  
		required: true 
	})
  password: string;

	@Prop({
    default: Date.now
  })
  createdAt: Date

	@Prop({  
		required: true,
    enum: Role
	})
  role:string
}

export const UserSchema = SchemaFactory.createForClass(User);