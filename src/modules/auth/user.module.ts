import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { User, UserSchema } from '../../models/auth/user.schema';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/auth/user.service';

@Module({
      imports: [
            MongooseModule.forFeature([
              {
                name: User.name,
                schema: UserSchema
              }
            ])
      ],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtService]
})
export class UserModule { }