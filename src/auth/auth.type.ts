import { Field, ObjectType } from "@nestjs/graphql";
import { UserValidator } from "../database/validators/user.validor";

@ObjectType()
export class AuthType {
    @Field(() => UserValidator)
    user: UserValidator;

    @Field(() => String)
    token: string;

    @Field(() => Boolean)
    success: boolean;
}