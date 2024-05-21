export class SummarizeSettlement {
    label?: string;
    color?: string;
    value?: number;
    icon?: string;
    constructor(label?: string, color?: string, value?: number, icon?: string) {
        this.label = label;
        this.color = color;
        this.value = value;
        this.icon = icon;
    }
}