
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';

import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService

  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('User login')
  @Post('login')
  handleLogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response
    ) {
    return this.authService.login(req.user, response);
  }

  
  // @Public()
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

}
