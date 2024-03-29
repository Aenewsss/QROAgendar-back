import { Field, ObjectType } from "@nestjs/graphql";
import { paymentMethodEnum } from "../dto/payment_method.enum";

@ObjectType()
export class PaymentType {
    @Field()
    price: number;
    
    @Field()
    method: paymentMethodEnum;
}