import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import { UserValidator } from 'src/database/validators/user.validor';
import { UserService } from './user.service';

@Resolver(of => UserValidator)
export class UserResolver {
    constructor(private readonly userService: UserService) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => UserValidator)
    async getUserById(
        @Args('id') id: string,
    ): Promise<UserValidator> {
        return await this.userService.getUserById(id);
    }
}
