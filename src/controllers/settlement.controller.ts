import { Body, Controller, Delete, Get, HttpCode, HttpException, Logger, Param, Post, Put, Request, UsePipes, ValidationPipe } from "@nestjs/common";
import mongoose from "mongoose";
import { CurrentUser, JwtPayload } from "src/config/current-user.decorator";
import { SettlementDto } from "src/models/dto/settlement.dto";
import { Settlement } from "src/models/schemas/settlement.schema";
import { SummarizeSettlement } from "src/models/summarize-settlement.model";
import { VerticalBarModel } from "src/models/vertical-bar.model";
import { SettlementService } from "src/services/settlement.service";

@Controller('/api/settlement')
export class SettlementController {

    public constructor(private readonly settlementService: SettlementService) {}

    @Post()
    @HttpCode(204)
    public createSettlement(@Body() settlementDto: SettlementDto, @CurrentUser() user: JwtPayload): Promise<Settlement> {
        Logger.debug('Request to create new settlement');
        settlementDto.userId = user.sub;
        return this.settlementService.save(settlementDto);
    }

    @Put(':id')
    @UsePipes(new ValidationPipe())
    public updateSettlement(
        @CurrentUser() user: JwtPayload, 
        @Param('id') id?: string, 
        @Body() settlementDto?: SettlementDto
    ): Promise<Settlement> {
        Logger.debug('Request to update settlement: ' + id);
        if(!id) {
            throw new HttpException('Id is required', 400);
        }
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if(!isValid) { 
            throw new HttpException('Id is invalid', 400);
        }
        settlementDto.userId = user.sub;
        return this.settlementService.update(id, settlementDto);
    }

    @Get(':text')
    public getSettlementsByDescription(@Param('text') text?: string): Promise<Settlement[]> {
        Logger.debug('Request to get all settlements match text:' + text);
        if(!text) {
            throw new HttpException('Text is required', 400);
        }
        return this.settlementService.findAllByDescription(text);
    }

    @Get('/chart/:year')
    public getAllSettlementsInYearToChart(
        @CurrentUser() user: JwtPayload,
        @Param('year') year: number
    ): Promise<VerticalBarModel> {
        Logger.debug('Request to get all settlements in year: ' + year + ' to chart');
        return this.settlementService.findChartDatasetInYear(year, user.sub);
    }

    @Get('/:fromDate/:toDate')
    public getSettlementsForDates(
        @CurrentUser() user: JwtPayload,
        @Param('fromDate') fromDate: string, 
        @Param('toDate') toDate: string
    ): Promise<Settlement[]> {
        Logger.debug('Request to get settlement between: ' + fromDate + ' and ' + toDate);
        return this.settlementService.findAllByDateBetween(fromDate, toDate, user.sub);
    }

    @Get('/summarize/:fromDate/:toDate')
    public getSummarizeSettlementsForDates(
        @CurrentUser() user: JwtPayload,
        @Param('fromDate') fromDate: string, 
        @Param('toDate') toDate: string
    ): Promise<SummarizeSettlement[]> {
        Logger.debug('Request to get summarize settlements between: ' + fromDate + ' and ' + toDate);
        return this.settlementService.findSummarizeSettlementsByDateBetween(fromDate, toDate, user.sub);
    }

    @Delete(':id')
    @HttpCode(204)
    public deleteSettlement(@Param('id') id: string): Promise<void> {
        Logger.debug('Request to delete settlement: ' + id);
        return this.settlementService.deleteById(id);
    }
}