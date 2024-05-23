import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SettlementSaving } from "src/models/schemas/settlement-saving.schema";

@Injectable()
export class SettlementSavingService {

    constructor(
        @InjectModel(SettlementSaving.name)
        private settlementSavingModel: Model<SettlementSaving>
    ) {}
}