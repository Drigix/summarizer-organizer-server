import { Logger } from "@nestjs/common";

export class DateUtil {

  static simpleDateFormatter(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  static getFirstDayOfMonth(date: Date): string {
    date = new Date(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = '01';

    return `${year}-${month}-${day}`;
  }

  static getLastDayOfMonth(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const lastDay = new Date(year, month, 0).getDate().toString().padStart(2, '0');

    return `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
  }
}
