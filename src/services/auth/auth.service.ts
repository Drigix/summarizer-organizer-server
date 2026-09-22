import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  private saltOrRounds: number = 10;    

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(username);
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    return {
      // 💡 Here the JWT secret key that's used for signing the payload 
      // is the key that was passed in the JwtModule
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(payload: any) {
    const hashPass = await bcrypt.hash(payload.password, this.saltOrRounds)

    let data = {
      ...payload,
      password: hashPass
    }

    const user = await this.usersService.create(data);
    return user;
  }
}