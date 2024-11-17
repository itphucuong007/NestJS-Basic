import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from 'src/users/user.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Post()
  // create(
  //   @Body() userDB: CreateUserDto,
  // ) {
  //   return this.usersService.create(userDB);
  // }

  // @Get(':id')
  // findOne(
  //   @Param('id') id: string
  // ) {
  //   return this.usersService.findOne(id);
  // }

  // @Patch()
  // update(@Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(id);
  // }


  @Post()
  @ResponseMessage("Create a new User")
  async create(@Body() hoidanit: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(hoidanit, user);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt
    }
  }



  @Patch()
  @ResponseMessage("Update a User")
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    let updatedUser = await this.usersService.update(updateUserDto, user);
    return updatedUser;
  }


  @Delete(':id')
  @ResponseMessage("Delete a User")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);

  }


  @Public()
  @Get(':id')
  @ResponseMessage('Fetch user by id')
  async findOne(@Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    return foundUser;

  }

  @Get()
  @ResponseMessage("Fetch user with paginate")
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }


}
