
import mongoose from 'mongoose';
import { Type } from 'class-transformer';

import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';

//data transfer object // class = { }
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

}


export class CreateUserDto {
    @IsNotEmpty({ message: 'chưa nhập name' })
    name: string;

    @IsEmail()
    @IsNotEmpty({ message: 'chưa nhập email' })
    email: string;

    @IsNotEmpty({ message: 'chưa nhập password' })
    password: string;

    @IsNotEmpty({ message: 'chưa nhập age' })
    age: number

    @IsNotEmpty({ message: 'chưa nhập gender' })
    gender: string;

    @IsNotEmpty({ message: 'chưa nhập address' })
    address: string;



    @IsNotEmpty({ message: 'chưa nhập role' })
    @IsMongoId({ message: "Role là mongo object id" })
    role: mongoose.Schema.Types.ObjectId;



    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}




export class RegisterUserDto {
    @IsNotEmpty({ message: 'Name không được để trống', })
    name: string;

    @IsEmail({}, { message: 'Email không đúng định dạng', })
    @IsNotEmpty({ message: 'Email không được để trống', })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống', })
    password: string;

    @IsNotEmpty({ message: 'Age không được để trống', })
    age: number;

    @IsNotEmpty({ message: 'Gender không được để trống', })
    gender: string;

    @IsNotEmpty({ message: 'Address không được để trống', })
    address: string;

}
