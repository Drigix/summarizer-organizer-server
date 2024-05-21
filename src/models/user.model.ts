import { Document } from 'mongoose';

export interface User extends Document {
  readonly userId: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}