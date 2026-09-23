import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request } from "@nestjs/common";
import { Public } from "src/config/public.decorator";
import { TokenPairModel } from "src/models/auth/token-pair.model";
import { UserLoginDto } from "src/models/dto/user-login.dto";
import { AuthService } from "src/services/auth/auth.service";

@Controller('/api/auth')
export class AuthController {

 constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(@Body() signInDto: UserLoginDto): Promise<TokenPairModel> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}