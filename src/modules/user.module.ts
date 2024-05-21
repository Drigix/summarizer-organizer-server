import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { userProviders } from 'src/providers/user.providers';
import { UserController } from 'src/controllers/user.controller';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [
    UserService,
    ...userProviders,
  ],
})
export class UserModule {}