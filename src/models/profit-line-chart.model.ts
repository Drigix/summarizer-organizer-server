export class ProfitLineChartModel {
  labels?: string[];
  datasets?: ProfitLineChartDataModel[];

  constructor(labels?: string[], datasets?: ProfitLineChartDataModel[]) {
      this.labels = labels;
      this.datasets = datasets;
  }
}

export class ProfitLineChartDataModel {
  label?: string;
  borderColor?: string;
  data?: number[];
  fill?: boolean;
  tension?: number;

  constructor(label?: string, borderColor?: string, data?: number[], fill?: boolean, tension?: number) {
      this.label = label;
      this.borderColor = borderColor;
      this.data = data;
      this.fill = fill;
      this.tension = tension;
  }
}
