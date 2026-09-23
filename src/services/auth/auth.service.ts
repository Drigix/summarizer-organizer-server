import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenPairModel } from 'src/models/auth/token-pair.model';
import { User } from 'src/models/auth/user.schema';
import { UserService } from './user.service';

@Injectable()
export class AuthService {

  private saltOrRounds: number = 12;    

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {
  }

  async signIn(
    username: string,
    password: string,
  ): Promise<TokenPairModel> {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    return new TokenPairModel(accessToken);
  }

  async signUp(payload: User) {
    const hashPass = await bcrypt.hash(payload.password, this.saltOrRounds)
    payload.password = hashPass;
    const user = await this.userService.create(payload);
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}