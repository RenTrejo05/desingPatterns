import type { Loan } from "@/models/Loan";

interface LoanListProps {
  loans: Loan[];
  returningId: number | null;
  onReturn: (loanId: number) => void;
}

export default function LoanList({ loans, returningId, onReturn }: LoanListProps) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--coral)]">Currently borrowed</p>
        <h2 className="mt-1 text-2xl font-bold">Active loans</h2>
      </div>
      {loans.length === 0 ? <p className="rounded-lg bg-[#f3eee5] p-4 text-[var(--muted)]">No active loans. Borrow a book to see it here.</p> : <div className="space-y-3">
        {loans.map((loan) => <div className="flex flex-col gap-3 rounded-xl border border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between" key={loan.id}>
          <div>
            <p className="font-semibold">{loan.bookTitle}</p>
            <p className="text-sm text-[var(--muted)]">{loan.borrowerName} · {loan.borrowerType === "student" ? "Student" : "Standard"}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-[var(--muted)]">Due {loan.dueDate}</p>
          </div>
          <button className="rounded-lg border border-[var(--coral)] px-4 py-2 text-sm font-bold text-[var(--coral)] hover:bg-[#f6e4df] disabled:cursor-not-allowed disabled:opacity-50" disabled={returningId === loan.id} onClick={() => onReturn(loan.id)}>
            {returningId === loan.id ? "Returning..." : "Return book"}
          </button>
        </div>)}
      </div>}
    </section>
  );
}
