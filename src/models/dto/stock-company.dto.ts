import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class StockCompanyDto {
    @IsNotEmpty()
    @IsString()
    stockSymbol: string;

    icon?: string;

    @IsNotEmpty()
    @IsString()
    companyName: string;

    @IsNotEmpty()
    @IsString()
    currency: string;

    @IsNotEmpty()
    @IsNumber()
    currentPrice: number;

    @IsNotEmpty()
    @IsDateString()
    updatedAt: Date;
}