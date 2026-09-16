import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class StockCompanyDto {
    @IsNotEmpty()
    @IsString()
    stockSymbol: string;

    @IsOptional()
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

    fromEntity(entity: any): StockCompanyDto {
        this.stockSymbol = entity.stockSymbol;
        this.companyName = entity.companyName;
        this.icon = entity.icon
            ? `data:${entity.iconContentType};base64,${entity.icon.toString('base64')}`
            : undefined;
        this.currency = entity.currency;
        this.currentPrice = entity.currentPrice;
        this.updatedAt = entity.updatedAt;
        return this;
    }
}