import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/user.interface';
import { RegisterUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response } from 'express';
import { log } from 'console';
import { BadRequestException, Injectable } from '@nestjs/common';

import { RolesService } from 'src/roles/roles.service';



@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,

        private rolesService: RolesService,

    ) { }

    //ussername/ pass là 2 tham số thư viện passport nó ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {

                const userRole = user.role as unknown as { _id: string; name: string };
                const temp = await this.rolesService.findOne(userRole._id);
                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }
                return objUser;

            }
        }

        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
            sub: "token login", // Thêm subject
            iss: "from server", // thêm issuer
            _id,
            name,
            email,
            role
        };

        const refresh_token = this.createRefreshToken(payload);

        //update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id);

        //set refresh_token as cookies
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
        })

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
            }
        };
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_ACCESS_EXPIRE')) / 1000,
        });
        return refresh_token;
    }


    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return {
            _id: newUser?._id,
            createdAt: newUser?.createdAt
        }

    }

processNewToken = async (refreshToken: string, response: Response) => {
    try {
        this.jwtService.verify(refreshToken, {
            secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
        })

        let user = await this.usersService.findUserByToken(refreshToken);

        if (user) {
            const { _id, name, email, role } = user;
            const payload = {
                sub: "token refresh",
                iss: "from server",
                _id,
                name,
                email,
                role
            };


            const refresh_token = this.createRefreshToken(payload);

            //update user with refresh token
            await this.usersService.updateUserToken(refresh_token, _id.toString());

            //fetch user's role
            const userRole = user.role as unknown as { _id: string; name: string }
            const temp = await this.rolesService.findOne(userRole._id)



            //set refresh_token as cookies
            response.clearCookie("refresh_token");

            //set refresh_token as cookies
            response.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: ms(this.configService.get<string>("JWT_REFRESH_EXPIRE"))
            });

            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    _id,
                    name,
                    email,
                    role,
                    permissions: temp?.permissions ?? []
                }
            };

        } else {
            throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login lại")
        }


    } catch (error) {
        throw new BadRequestException("Refresh token không hợp lệ. Vui lòng login lại")
    }
}

    logout = async (response: Response, user: IUser) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "ok";
    }



}
