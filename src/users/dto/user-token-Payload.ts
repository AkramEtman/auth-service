import mongoose from 'mongoose';

export interface ITokenPayload {
  user:{
    _id: mongoose.Types.ObjectId;
  },
  iat?: number;
  exp?: number;
}