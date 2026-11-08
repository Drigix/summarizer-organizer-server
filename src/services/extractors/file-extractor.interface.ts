import { FileTypeEnum } from "src/models/enums/file-type.enum";


export interface FileExtractor {
    readonly type: FileTypeEnum;

    export(data: any[]): Promise<Buffer>;
}

export const FILE_EXTRACTORS = Symbol('FILE_EXTRACTORS');