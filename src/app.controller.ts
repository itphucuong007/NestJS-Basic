import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Controller, Get, Post, Render, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

import { Public } from './decorator/customize';
import { LocalAuthGuard } from './auth/local-auth.guard';



@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService,
    // private configService: ConfigService,
    // private authService: AuthService

  ) { }

  // @Public()
  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // handleLogin(@Request() req) {
  //   return this.authService.login(req.user);
  // }

  
  // @Public()
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

  

}
