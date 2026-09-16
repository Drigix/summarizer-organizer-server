import { BadRequestException } from "@nestjs/common";

export class IconUtil {
    public static parseIconDataUrl(dataUrl?: string): { buffer: Buffer; contentType: string } | undefined {
        if (!dataUrl) return undefined;
        const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (!match) {
            throw new BadRequestException('Nieprawidłowy format ikony');
        }
        const [, contentType, base64Data] = match;
        return { buffer: Buffer.from(base64Data, 'base64'), contentType };
    }
}