import type { FormEvent } from "react";
import type { Book } from "@/models/Book";
import type { BorrowerType } from "@/models/Loan";

interface LoanFormProps {
  books: Book[];
  borrowerName: string;
  borrowerType: BorrowerType;
  dueDate: string;
  selectedBookId: string;
  submitting: boolean;
  onBorrowerNameChange: (value: string) => void;
  onBorrowerTypeChange: (value: BorrowerType) => void;
  onDueDateChange: (value: string) => void;
  onSelectedBookChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function LoanForm(props: LoanFormProps) {
  const availableBooks = props.books.filter((book) => book.available);
  return (
    <section className="rounded-2xl bg-[var(--teal)] p-6 text-white shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b9ded5]">New loan</p>
      <h2 className="mt-1 text-2xl font-bold">Borrow a book</h2>
      <form className="mt-5 space-y-4" onSubmit={props.onSubmit}>
        <label className="block text-sm font-semibold">Book
          <select className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-[var(--ink)]" value={props.selectedBookId} onChange={(event) => props.onSelectedBookChange(event.target.value)} required>
            <option value="">Choose an available book</option>
            {availableBooks.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold">Borrower name
          <input className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-[var(--ink)]" value={props.borrowerName} onChange={(event) => props.onBorrowerNameChange(event.target.value)} placeholder="e.g. Ana Lopez" required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">Borrower type
            <select className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-[var(--ink)]" value={props.borrowerType} onChange={(event) => props.onBorrowerTypeChange(event.target.value as BorrowerType)}>
              <option value="standard">Standard ($5/day)</option>
              <option value="student">Student ($2/day)</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">Due date
            <input className="mt-1 w-full rounded-lg border-0 bg-white px-3 py-2 text-[var(--ink)]" type="date" value={props.dueDate} onChange={(event) => props.onDueDateChange(event.target.value)} required />
          </label>
        </div>
        <button className="w-full rounded-lg bg-[#f2c66d] px-4 py-3 font-bold text-[var(--ink)] transition hover:bg-[#f5d58f] disabled:cursor-not-allowed disabled:opacity-60" disabled={props.submitting || availableBooks.length === 0} type="submit">
          {props.submitting ? "Creating loan..." : "Create loan"}
        </button>
      </form>
    </section>
  );
}
