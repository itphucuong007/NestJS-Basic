import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestGuard } from './test.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(
    @Body() userDB: CreateUserDto,
  ) {
    return this.usersService.create(userDB);
  }
  
  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
     
    return this.usersService.findOne(id);
  }
  
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseGuards(TestGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

}
