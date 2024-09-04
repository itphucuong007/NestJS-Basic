import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';

import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);

    // fix create api create new user for video 22.2
    // link: http://localhost:8000/users/
    var hash = hashSync(password, salt);

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


  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }


  // tài liệu: https://www.npmjs.com/package/bcrypt 
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
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
