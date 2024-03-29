import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { AuthType } from './auth.type';
import * as bcrypt from "bcrypt";
import { TokenType } from "./token.type";
import { UserValidator } from "../database/validators/user.validor";

@Injectable()
export class AuthService {
    constructor(
        @Inject('USER_MODEL')
        private userModel: Model<UserValidator>,
        private jwtService: JwtService
    ) { }

    async login(email: string, password: string): Promise<AuthType> {
        const user = await this.userModel.findOne({ email });
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user, email, password, user.password, isMatch)

        if (!user || !isMatch) throw new NotFoundException('User not found. Please, check your credentials');

        return {
            user,
            token: await this.jwtToken(user),
            success: true
        }
    }

    async verifyToken(token: string): Promise<TokenType> {
        const decodedToken = await this.jwtService.verify(token.replace('Bearer ', ''));

        const userId = decodedToken.sub;
        const userRole = decodedToken.role;
        return {
            userId,
            userRole
        }
    }

    private async jwtToken(user: UserValidator): Promise<string> {
        const payload = { username: user.name, sub: user.id, role: user.role };
        return this.jwtService.signAsync(payload);
    }

}
