import * as mongoose from "mongoose";
import { Role } from "../../../auth/enums/role.enum";
import { IUserSession } from "../../../sessions/dto/userSession.dto";

export const UserSessionStub = ( data:any = {} ):IUserSession => {
  return {
    _id: data._id ?? new mongoose.Types.ObjectId(),
    role: Role.Admin,
    username: "ali omar"
  }
}

export const UserSessionKeyStub = ( data:any = {} ):string => {
  let userId = data._id ?? new mongoose.Types.ObjectId() 
  return "session:" + userId.toString()
}