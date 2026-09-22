import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/auth/user.schema.js';
import { UsersService } from 'src/services/auth/user.service';

@Module({
      imports: [
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema
          }
        ])
      ],
    controllers: [],
    providers: [UsersService]
})
export class UsersModule {}