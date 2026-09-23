import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { User, UserSchema } from '../../models/auth/user.schema';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/services/auth/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/config/auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
      imports: [
            MongooseModule.forFeature([
              {
                name: User.name,
                schema: UserSchema
              }
            ]),
            JwtModule.registerAsync({
                  global: true,
                  inject: [ConfigService],
                  useFactory: (config: ConfigService) => ({
                    secret: config.getOrThrow<string>('JWT_SECRET'),
                    signOptions: { expiresIn: config.get('JWT_EXPIRES_IN', '15m') },
                  }),
            }),
      ],
    controllers: [AuthController],
    providers: [
      AuthService, 
      UserService, 
      {
        provide: APP_GUARD,
        useClass: AuthGuard,
      }
    ]
})
export class UserModule { }