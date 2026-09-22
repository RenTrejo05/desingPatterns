export interface LateFeeStrategy {
  calculate(dueDate: string, returnDate: string): number;
}

export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function lateDaysBetween(dueDate: string, returnDate: string): number {
  const due = Date.parse(`${dueDate}T00:00:00Z`);
  const returned = Date.parse(`${returnDate}T00:00:00Z`);
  const days = Math.floor((returned - due) / 86400000);
  return Math.max(0, days);
}
