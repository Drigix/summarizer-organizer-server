import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { PriceType } from "../types/price.type";
import { SettlementSavingType } from "../types/settlement-saving.type";

export class SettlementSavingDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsOptional()
    @IsDateString()
    dateTo?: Date;

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
    savingType: SettlementSavingType;

    @IsOptional()
    @IsNumber()
    percent?: number;

    @IsOptional()
    @IsNumber()
    percentPeriod?: number;

    @IsNotEmpty()
    priceType: PriceType;
}