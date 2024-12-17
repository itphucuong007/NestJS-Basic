import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

import { User as UserM, UserDocument } from './schemas/user.schema';
import { User } from 'src/decorator/customize';

import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { IUser } from './user.interface';

import aqp from 'api-query-params';



@Injectable()
export class UsersService {

  constructor(
    // tránh trùng lặp với decorator User
    @InjectModel(UserM.name)

    private userModel: SoftDeleteModel<UserDocument>

  ) { }

  getHashPassword = (password: string) => {
    var salt = genSaltSync(10);
    var hash = hashSync(password, salt);

    return hash;
  }


  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
      .populate({ path: "role", select: { name: 1, permissions: 1 } })
  }


  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }


  async register(user: RegisterUserDto) {
    const { name, email, password, age, gender, address } = user;

    //add logic check email |
    const isExist = await this.userModel.findOne({ email })
    if (isExist) {
      throw new BadRequestException(`Email: ${email} is ready exist `)
    }

    const hashPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      age,
      gender,
      address,
      role: "USER"
    })

    return newRegister;

  }



  async create(createuserDto: CreateUserDto, @User() user: IUser) {
    const {
      name, email, password, age,
      gender, address, role, company
    }
      = createuserDto;

    //add logic check email |
    const isExist = await this.userModel.findOne({ email })
    if (isExist) {
      throw new BadRequestException(`Email: ${email} is ready exist, cannot create user `)
    }

    const hashPassword = this.getHashPassword(password);
    let newUser = await this.userModel.create({
      name, email,
      password: hashPassword,
      age,
      gender, address, role, company,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })

    return newUser;
  }


  async update(updateUserDto: UpdateUserDto, user: IUser) {
    const updated = await this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
    return updated;

  }




  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "not found user";

    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === "admin@gmail.com") {
      throw new BadRequestException('Không thể xoá tài khoản admin@gmail.com');
    }

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      })

    return this.userModel.softDelete({
      _id: id
    })

  }


  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return 'not found user';

    return await this.userModel.findOne({
      _id: id
    }).select("-password")

      .populate({ path: "role", select: { name: 1, _id: 1 } });
  }



  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select("-password")
      .populate(population)
      .exec();


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tỏng số trang với điều kiện url query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //két qua query
    }

  }


  updateUserToken = async (refreshToken: string, _id: string) => {
    return await this.userModel.updateOne(
      { _id },
      { refreshToken }
    )
  }


  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken })
  }

}
