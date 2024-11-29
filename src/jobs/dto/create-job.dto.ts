import { IsArray, IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
import { Transform, Type } from 'class-transformer';


class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string;

}

export class CreateJobDto {

    @IsNotEmpty({ message: 'chưa nhập name' })
    name: string;

    @IsNotEmpty({ message: 'chưa nhập skills' })
    @IsArray({ message: 'chưa nhập skills' })
    @IsString({ each: true, message: 'chưa nhập skills' })
    skills: string[];

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

    @IsNotEmpty({ message: 'chưa nhập salary' })
    salary: number;

    @IsNotEmpty({ message: 'chưa nhập quantity' })
    quantity: number

    @IsNotEmpty({ message: 'chưa nhập level' })
    level: string;

    @IsNotEmpty({ message: 'chưa nhập description' })
    description: string;

    @IsNotEmpty({ message: 'startDate không được để trống', })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'startDate có định dạng Date' })
    startDate: Date;

    @IsNotEmpty({ message: 'endDate không được để trống', })
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'endDate có định dạng Date' })
    endDate: Date;

    @IsNotEmpty({ message: 'isActive không được để trống' })
    @IsBoolean({ message: 'isActive có định dạng boolean' })
    isActive: boolean;

}
