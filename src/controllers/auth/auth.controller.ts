import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/config/auth.guard";
import { TokenPairModel } from "src/models/auth/token-pair.model";
import { UserLoginDto } from "src/models/dto/user-login.dto";
import { AuthService } from "src/services/auth/auth.service";

@Controller('/api/auth')
export class AuthController {

 constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(@Body() signInDto: UserLoginDto): Promise<TokenPairModel> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}