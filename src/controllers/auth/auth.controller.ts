import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/config/auth.guard";
import { AuthService } from "src/services/auth/auth.service";

@Controller('/api/auth')
export class AuthController {

 constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async signIn(@Body() signInDto: Record<string, any>): Promise<{access_token: string}> {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}