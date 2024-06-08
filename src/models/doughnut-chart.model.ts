export class DoughnutChartModel {
  labels?: string[];
  datasets?: DoughnutChartDataModel[];

  constructor(labels?: string[], datasets?: DoughnutChartDataModel[]) {
      this.labels = labels;
      this.datasets = datasets;
  }
}

export class DoughnutChartDataModel {
  label?: string;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  data?: number[];

  constructor(label?: string, backgroundColor?: string, hoverBackgroundColor?: string, data?: number[]) {
      this.label = label;
      this.backgroundColor = backgroundColor;
      this.hoverBackgroundColor = hoverBackgroundColor;
      this.data = data;
  }
}
