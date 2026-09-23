import { Prop } from "@nestjs/mongoose";

export class BaseEntity {
    @Prop({required: true})
    userId: string;
}