import { BookRepository } from "@/repositories/BookRepository";
import { LoanRepository } from "@/repositories/LoanRepository";
import type { BorrowerType, CreateLoanInput } from "@/models/Loan";
import { isValidDateString, lateDaysBetween } from "@/strategies/LateFeeStrategy";
import { StandardLateFeeStrategy } from "@/strategies/StandardLateFeeStrategy";
import { StudentLateFeeStrategy } from "@/strategies/StudentLateFeeStrategy";

function isBorrowerType(value: unknown): value is BorrowerType {
  return value === "standard" || value === "student";
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const LoanController = {
  list() {
    return { ok: true as const, data: LoanRepository.findActive() };
  },

  create(input: unknown) {
    const data = input as Partial<CreateLoanInput>;
    const borrowerName = typeof data.borrowerName === "string" ? data.borrowerName.trim() : "";
    if (!borrowerName) return { ok: false as const, error: "Borrower name is required.", status: 400 };
    if (!isBorrowerType(data.borrowerType)) return { ok: false as const, error: "Borrower type must be standard or student.", status: 400 };
    if (typeof data.bookId !== "number" || !Number.isInteger(data.bookId)) return { ok: false as const, error: "A valid book is required.", status: 400 };
    if (typeof data.dueDate !== "string" || !isValidDateString(data.dueDate)) return { ok: false as const, error: "Due date must be a valid date.", status: 400 };

    const book = BookRepository.findById(data.bookId);
    if (!book) return { ok: false as const, error: "Book not found.", status: 404 };
    if (!book.available) return { ok: false as const, error: "That book is currently unavailable.", status: 409 };

    const loan = LoanRepository.create({ bookId: book.id, borrowerName, borrowerType: data.borrowerType, dueDate: data.dueDate });
    BookRepository.markUnavailable(book.id);
    return { ok: true as const, data: loan, status: 201 };
  },

  returnLoan(id: number) {
    if (!Number.isInteger(id)) return { ok: false as const, error: "A valid loan is required.", status: 400 };
    const loan = LoanRepository.findById(id);
    if (!loan) return { ok: false as const, error: "Loan not found.", status: 404 };
    if (loan.returnedAt) return { ok: false as const, error: "This loan has already been returned.", status: 409 };

    const returnedAt = today();
    const strategy = loan.borrowerType === "student" ? new StudentLateFeeStrategy() : new StandardLateFeeStrategy();
    const lateFeeCents = strategy.calculate(loan.dueDate, returnedAt);
    const returnedLoan = LoanRepository.markReturned(id, returnedAt, lateFeeCents);
    BookRepository.markAvailable(loan.bookId);
    const lateDays = lateDaysBetween(loan.dueDate, returnedAt);
    return { ok: true as const, data: { loan: returnedLoan, lateDays, lateFeeCents }, status: 200 };
  },
};
