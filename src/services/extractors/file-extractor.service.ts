import { Inject, Injectable } from "@nestjs/common";
import { FileTypeEnum } from "src/models/enums/file-type.enum";
import { FILE_EXTRACTORS, FileExtractor } from "./file-extractor.interface";
import { ReportTypeEnum } from "src/models/enums/report-type.enum";
import { REPORT_DEFINITIONS, ReportDefinition } from "src/models/reports/definition-interface.report";

@Injectable()
export class FileExtractorService {
    private readonly exporters: Map<FileTypeEnum, FileExtractor>;
    private readonly reports: Map<ReportTypeEnum, ReportDefinition>;

    constructor(
        @Inject(FILE_EXTRACTORS) exporters: FileExtractor[],
        @Inject(REPORT_DEFINITIONS) reports: ReportDefinition[],
    ) {
        this.exporters = new Map(exporters.map(e => [e.type, e]));
        this.reports = new Map(reports.map(r => [r.type, r]));
    }

    public extractToFile(
        fileType: FileTypeEnum,
        reportType: ReportTypeEnum,
        data: any[],
    ): Promise<Buffer> {
        const exporter = this.exporters.get(fileType);
        if (!exporter) {
            throw new Error(`File type ${fileType} is not supported for export.`);
        }
        const report = this.reports.get(reportType);
        if (!report) {
            throw new Error(`Report type ${reportType} is not supported.`);
        }

        return exporter.export(report.build(data));
    }
}