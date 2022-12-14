import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';
import { userProvider } from 'src/database/providers/user.provider';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { UserService } from 'src/users/user.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
    imports: [
        DatabaseModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: () => ({
                secret: process.env.JWT_SECRET,
                signOptions: {
                    expiresIn: '30d'
                }
            }) 
        })
    ],
    controllers: [],
    providers: [...userProvider, AuthService, AuthResolver, JwtStrategy, UserService]
})
export class AuthModule { }
