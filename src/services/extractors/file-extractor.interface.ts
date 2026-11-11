import { FileTypeEnum } from "src/models/enums/file-type.enum";
import { ReportDocument } from "src/models/reports/document.report";


export interface FileExtractor {
    readonly type: FileTypeEnum;

    export(report: ReportDocument): Promise<Buffer>;
}

export const FILE_EXTRACTORS = Symbol('FILE_EXTRACTORS');