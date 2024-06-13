import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { PriceType } from "../types/price.type";

export class SettlementDto {
    @IsNotEmpty()
    @IsString()
    date: Date;

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @MinLength(2)
    description: string;

    @IsOptional()
    @IsString()
    @MaxLength(300)
    @MinLength(10)
    linkUrl?: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    priceType: PriceType;
}