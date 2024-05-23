import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
  controllers: [UserController],
  providers: [
    UserService
  ],
})
export class UserModule {}