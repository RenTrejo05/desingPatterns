export type BorrowerType = "standard" | "student";

export interface Loan {
  id: number;
  bookId: number;
  bookTitle: string;
  borrowerName: string;
  borrowerType: BorrowerType;
  borrowedAt: string;
  dueDate: string;
  returnedAt: string | null;
  lateFeeCents: number | null;
}

export interface CreateLoanInput {
  bookId: number;
  borrowerName: string;
  borrowerType: BorrowerType;
  dueDate: string;
}
