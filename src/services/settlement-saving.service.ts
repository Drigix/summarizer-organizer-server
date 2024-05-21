import { Inject, Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { SETTLEMENT_MODEL_PROVIDER, SETTLEMENT_SAVING_MODEL_PROVIDER } from "src/config/model-providers.config";
import { MONTHS_CONST } from "src/models/const/month.const";
import { SettlementSaving } from "src/models/settlement-saving.model";
import { Settlement } from "src/models/settlement.model";
import { SummarizeSettlement } from "src/models/summarize-settlement.model";
import { GroupVerticalBarModel, VerticalBarDataModel, VerticalBarModel } from "src/models/vertical-bar.model";

@Injectable()
export class SettlementSavingService {

    constructor(
        @Inject(SETTLEMENT_SAVING_MODEL_PROVIDER)
        private settlementSavingModel: Model<SettlementSaving>
    ) {}
}