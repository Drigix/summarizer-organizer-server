import { IsNotEmpty, IsString } from "class-validator";

export class UserDto {

    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    username: string;
}