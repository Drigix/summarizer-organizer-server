import { Body, Controller, Delete, Get, HttpCode, Logger, Param, Post, Request } from "@nestjs/common";
import { SummarizeSettlement } from "src/models/summarize-settlement.model";
import { VerticalBarModel } from "src/models/vertical-bar.model";
import { SettlementService } from "src/services/settlement.service";

@Controller('/api/settlement-saving')
export class SettlementSavingController { 

    constructor() {}
}