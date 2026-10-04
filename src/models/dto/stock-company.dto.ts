import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { BaseDto } from "./base.dto";

export class StockCompanyDto extends BaseDto {
    @IsNotEmpty()
    @IsString()
    stockSymbol: string;

    @IsNotEmpty()
    @IsString()
    oldStockSymbol: string;

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

    @IsBoolean()
    @IsOptional()
    updateSettlementSaving?: boolean;

    fromEntity(entity: any): StockCompanyDto {
        this.stockSymbol = entity.stockSymbol;
        this.oldStockSymbol = entity.stockSymbol;
        this.companyName = entity.companyName;
        this.icon = entity.icon
            ? `data:${entity.iconContentType};base64,${entity.icon.toString('base64')}`
            : undefined;
        this.currency = entity.currency;
        this.currentPrice = entity.currentPrice;
        this.updatedAt = entity.updatedAt;
        this.updateSettlementSaving = entity.updateSettlementSaving;
        return this;
    }
}