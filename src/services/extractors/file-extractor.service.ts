import { Inject, Injectable } from "@nestjs/common";
import { FileTypeEnum } from "src/models/enums/file-type.enum";
import { FILE_EXTRACTORS, FileExtractor } from "./file-extractor.interface";

@Injectable()
export class FileExtractorService {
    private readonly exporters: Map<FileTypeEnum, FileExtractor>;

    constructor(@Inject(FILE_EXTRACTORS) exporters: FileExtractor[]) {
        this.exporters = new Map(exporters.map(e => [e.type, e]));
    }

    public extractToFile(fileType: FileTypeEnum, data: any[]): Promise<Buffer> {
        const exporter = this.exporters.get(fileType);
        if (!exporter) {
            throw new Error(`File type ${fileType} is not supported for export.`);
        }
        return exporter.export(data);
    }
}