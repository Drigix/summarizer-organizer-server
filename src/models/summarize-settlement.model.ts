import { PriceType } from "./types/price.type";

export class SummarizeSettlement {
    label?: string;
    color?: string;
    value?: number;
    balance?: number;
    icon?: string;
    type?: PriceType;

    constructor(label?: string, color?: string, value?: number, balance?: number, icon?: string, type?: PriceType) {
        this.label = label;
        this.color = color;
        this.value = value;
        this.balance = balance;
        this.icon = icon;
        this.type = type;
    }
}