import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { EmployeeType } from "../dto/employee.type";
import { PaymentType } from "../dto/payment.interface";

@ObjectType('Schedule')
export class ScheduleValidator {
    @Field(type => ID)
    @IsNotEmpty()
    id: string;

    @Field()
    @IsNotEmpty()
    pet_name: string;

    @Field()
    @IsNotEmpty()
    customer_name: string;

    @Field()
    @IsNotEmpty()
    customer_phone: string;

    @Field()
    @IsNotEmpty()
    employee: EmployeeType;

    @Field()
    @IsNotEmpty()
    date: Date;

    @Field()
    @IsNotEmpty()
    pet_breed: string;

    @Field()
    @IsNotEmpty()
    payment: PaymentType;

}