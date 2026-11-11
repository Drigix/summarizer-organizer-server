import { ReportTypeEnum } from "../enums/report-type.enum";
import { ReportDocument } from "./document.report";


export interface ReportDefinition<T = any> {
    readonly type: ReportTypeEnum;
    build(data: T[]): ReportDocument;
}

export const REPORT_DEFINITIONS = Symbol('REPORT_DEFINITIONS');