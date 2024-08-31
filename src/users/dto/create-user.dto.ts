
import { IsEmail, IsNotEmpty } from 'class-validator';



export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty({
        message: 'chưa nhập email'
    })
    email: string;

    @IsNotEmpty({
        message: 'chưa nhập password'
    })
    password: string;
    name: string;
    address: string;
}
