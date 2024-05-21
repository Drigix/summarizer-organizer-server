import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userId: { type: Number, unique: true },
  firstName: String,
  lastName: String,
  email: String,
});
