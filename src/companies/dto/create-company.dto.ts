
import { IsNotEmpty } from 'class-validator';


export class CreateCompanyDto {

    @IsNotEmpty({ message: 'chưa nhập tên' })
    name: string;

    @IsNotEmpty({ message: 'chưa nhập địa chỉ' })
    address: string;

    @IsNotEmpty({ message: 'chưa nhập mô tả' })
    description: string;
}
