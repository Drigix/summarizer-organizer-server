import { PriceType } from "./types/price.type";

export class VerticalBarModel {
    labels?: string[];
    datasets?: VerticalBarDataModel[];

    constructor(labels?: string[], datasets?: VerticalBarDataModel[]) {
        this.labels = labels;
        this.datasets = datasets;
    }
}

export class VerticalBarDataModel {
    label?: string;
    backgroundColor?: string;
    borderColor?: string;
    data?: number[];

    constructor(label?: string, backgroundColor?: string, borderColor?: string, data?: number[]) {
        this.label = label;
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor;
        this.data = data;
    }
}

export class GroupVerticalBarModel {
    year?: number;
    month?: number;
    priceType?: PriceType | string;
    price?: number;
    constructor(year?: number, month?: number, priceType?: PriceType | string, price?: number) {
        this.year = year;
        this.month = month;
        this.priceType = priceType;
        this.price = price;
    }
}