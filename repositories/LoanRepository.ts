import { database } from "./Database";
import type { CreateLoanInput, Loan } from "@/models/Loan";
import type { BorrowerType } from "@/models/Loan";

type LoanRow = {
  id: number;
  book_id: number;
  book_title: string;
  borrower_name: string;
  borrower_type: BorrowerType;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
  late_fee_cents: number | null;
};

function toLoan(row: LoanRow): Loan {
  return {
    id: row.id,
    bookId: row.book_id,
    bookTitle: row.book_title,
    borrowerName: row.borrower_name,
    borrowerType: row.borrower_type,
    borrowedAt: row.borrowed_at,
    dueDate: row.due_date,
    returnedAt: row.returned_at,
    lateFeeCents: row.late_fee_cents,
  };
}

const loanSelect = `
  SELECT loans.id, loans.book_id, books.title AS book_title,
    loans.borrower_name, loans.borrower_type, loans.borrowed_at,
    loans.due_date, loans.returned_at, loans.late_fee_cents
  FROM loans
  INNER JOIN books ON books.id = loans.book_id
`;

export const LoanRepository = {
  findActive(): Loan[] {
    const rows = database.prepare(`${loanSelect} WHERE loans.returned_at IS NULL ORDER BY loans.due_date`).all() as LoanRow[];
    return rows.map(toLoan);
  },

  findById(id: number): Loan | null {
    const row = database.prepare(`${loanSelect} WHERE loans.id = ?`).get(id) as LoanRow | undefined;
    return row ? toLoan(row) : null;
  },

  create(input: CreateLoanInput): Loan {
    const borrowedAt = new Date().toISOString().slice(0, 10);
    const result = database
      .prepare(`INSERT INTO loans (book_id, borrower_name, borrower_type, borrowed_at, due_date) VALUES (?, ?, ?, ?, ?)`)
      .run(input.bookId, input.borrowerName, input.borrowerType, borrowedAt, input.dueDate);
    const loan = this.findById(Number(result.lastInsertRowid));
    if (!loan) throw new Error("The new loan could not be loaded.");
    return loan;
  },

  markReturned(id: number, returnedAt: string, lateFeeCents: number): Loan {
    database.prepare("UPDATE loans SET returned_at = ?, late_fee_cents = ? WHERE id = ? AND returned_at IS NULL").run(returnedAt, lateFeeCents, id);
    const loan = this.findById(id);
    if (!loan) throw new Error("The returned loan could not be loaded.");
    return loan;
  },
};
