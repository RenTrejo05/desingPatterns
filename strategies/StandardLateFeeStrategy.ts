import { lateDaysBetween, type LateFeeStrategy } from "./LateFeeStrategy";

export class StandardLateFeeStrategy implements LateFeeStrategy {
  calculate(dueDate: string, returnDate: string): number {
    return lateDaysBetween(dueDate, returnDate) * 500;
  }
}
