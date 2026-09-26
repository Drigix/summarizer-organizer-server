import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { PriceType } from "../types/price.type";
import { BaseDto } from "./base.dto";

export class SettlementDto extends BaseDto {
  @IsNotEmpty()
  @IsString()
  date: Date;

  @IsNotEmpty()
  @IsString()
  dateTo: Date;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(2)
  description: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  @MinLength(0)
  linkUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  priceType: PriceType;

  @IsOptional()
  updateAllRecords?: boolean;
}