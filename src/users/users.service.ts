import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { genSaltSync, hashSync } from 'bcryptjs';

import mongoose, { Model } from 'mongoose';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);
    var hash = hashSync("B4c0/\/", salt);
    return hash;
  }

  async create(userDB: CreateUserDto) {
    const hashPassword = this.getHashPassword(userDB.password)

    let user = await this.userModel.create({
      email: userDB.email,
      password: hashPassword,
      name: userDB.name

    })

    return user;
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Not found user ID';

    return this.userModel.findOne({
      _id: id,
    });

  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }

  remove(id: string) {

    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Not found user ID';

    return this.userModel.deleteOne({
      _id: id,
    });

  }

  findAll() {
    return `This action returns all users`;
  }


}
