import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from './schemas/user.schema';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)

    private userModel: SoftDeleteModel<UserDocument>

  ) { }

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);
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


  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }



  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto })
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'Not found user ID';

    return this.userModel.softDelete({

      _id: id,
    });

  }

  findAll() {
    return `This action returns all users`;
  }


}
