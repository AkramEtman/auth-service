import mongoose from 'mongoose';

export interface IUserSession {
  _id: mongoose.Types.ObjectId;
  role: string;
  username: string;
}