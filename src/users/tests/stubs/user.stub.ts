import * as mongoose from "mongoose";
import { Role } from "../../../auth/enums/role.enum";
import { User } from "../../../users/entities/user.entity";

export const UserStub = ( data:any = {} ):User => {
  return {
    _id: data._id ?? new mongoose.Types.ObjectId(),
    email: data.email ?? "test@mail.com",
    role: data.role ?? Role.Admin,
    username: data.username ?? "ali",
    //todo password
    password: data.password ?? "password",
    createdAt: data.createdAt ?? Date.now()
  }
}
