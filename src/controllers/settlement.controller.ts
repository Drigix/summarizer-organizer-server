import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Request } from "@nestjs/common";
import { Settlement } from "src/models/settlement.model";
import { SummarizeSettlement } from "src/models/summarize-settlement.model";
import { VerticalBarModel } from "src/models/vertical-bar.model";
import { SettlementService } from "src/services/settlement.service";

@Controller('/api/settlement')
export class SettlementController {

    public constructor(private readonly settlementService: SettlementService) {}

    @Post()
    @HttpCode(204)
    public createSettlement(@Body() settlement: Settlement): Promise<Settlement> {
        return this.settlementService.save(settlement);
    }

    @Get()
    public getSettlements(): Promise<Settlement[]> {
        Logger.debug('Request to get all settlements');
        return this.settlementService.findAll();
    }

    // @Get('/:userId/:fromDate/:toDate')
    // public getSettlementsForUserAndDate(
    //     @Param('userId') userId: number, 
    //     @Param('fromDate') fromDate: string, 
    //     @Param('toDate') toDate: string): Promise<Settlement[]> {
    //     Logger.debug('Request to get settlement for user: ' + userId + ' from ' + fromDate + ' to ' + toDate);
    //     return this.settlementService.findAllByUserIdAndDateBetween(userId, fromDate, toDate);
    // }

    @Get('/chart/:year')
    public getAllSettlementsInYearToChart(
        @Param('year') year: number): Promise<VerticalBarModel> {
        Logger.debug('Request to get all settlements in year: ' + year + ' to chart');
        return this.settlementService.findChartDatasetInYear(year);
    }

    @Get('/:fromDate/:toDate')
    public getSettlementsForDates(
        @Param('fromDate') fromDate: string, 
        @Param('toDate') toDate: string): Promise<Settlement[]> {
        Logger.debug('Request to get settlement between: ' + fromDate + ' and ' + toDate);
        return this.settlementService.findAllByDateBetween(fromDate, toDate);
    }

    @Get('/summarize/:fromDate/:toDate')
    public getSummarizeSettlementsForDates(
        @Param('fromDate') fromDate: string, 
        @Param('toDate') toDate: string): Promise<SummarizeSettlement[]> {
        Logger.debug('Request to get summarize settlements between: ' + fromDate + ' and ' + toDate);
        return this.settlementService.findSummarizeSettlementsByDateBetween(fromDate, toDate);
    }

    @Delete(':id')
    @HttpCode(204)
    public deleteSettlement(@Param('id') id: string): Promise<void> {
        Logger.debug('Request to delete settlement: ' + id);
        return this.settlementService.deleteById(id);
    }
}