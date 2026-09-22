"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import BookList from "@/components/BookList";
import LoanForm from "@/components/LoanForm";
import LoanList from "@/components/LoanList";
import StatusMessage from "@/components/StatusMessage";
import type { Book } from "@/models/Book";
import type { BorrowerType, Loan } from "@/models/Loan";

function defaultDueDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerType, setBorrowerType] = useState<BorrowerType>("standard");
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [status, setStatus] = useState<{ message: string; tone: "success" | "error" } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [returningId, setReturningId] = useState<number | null>(null);

  async function loadData() {
    const [booksResponse, loansResponse] = await Promise.all([fetch("/api/books"), fetch("/api/loans")]);
    const booksData = await booksResponse.json() as { ok: boolean; data?: Book[]; error?: string };
    const loansData = await loansResponse.json() as { ok: boolean; data?: Loan[]; error?: string };
    if (!booksData.ok || !loansData.ok) throw new Error(booksData.error ?? loansData.error ?? "Data could not be loaded.");
    setBooks(booksData.data ?? []);
    setLoans(loansData.data ?? []);
  }

  useEffect(() => {
    loadData().catch((error: Error) => setStatus({ message: error.message, tone: "error" }));
  }, []);

  async function handleCreateLoan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const response = await fetch("/api/loans", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookId: Number(selectedBookId), borrowerName, borrowerType, dueDate }) });
      const result = await response.json() as { ok: boolean; data?: Loan; error?: string };
      if (!response.ok || !result.ok) throw new Error(result.error ?? "The loan could not be created.");
      setStatus({ message: `${result.data?.bookTitle} is now on loan to ${borrowerName}.`, tone: "success" });
      setBorrowerName("");
      setSelectedBookId("");
      await loadData();
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : "The loan could not be created.", tone: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReturn(loanId: number) {
    setReturningId(loanId);
    setStatus(null);
    try {
      const response = await fetch(`/api/loans/${loanId}/return`, { method: "POST" });
      const result = await response.json() as { ok: boolean; data?: { loan: Loan; lateDays: number; lateFeeCents: number }; error?: string };
      if (!response.ok || !result.ok || !result.data) throw new Error(result.error ?? "The loan could not be returned.");
      const { loan, lateDays, lateFeeCents } = result.data;
      const feeMessage = lateFeeCents > 0 ? `Late fee: ${formatCents(lateFeeCents)} for ${lateDays} late day${lateDays === 1 ? "" : "s"}.` : "No late fee was charged.";
      setStatus({ message: `${loan.bookTitle} returned on ${loan.returnedAt}. ${feeMessage}`, tone: "success" });
      await loadData();
    } catch (error) {
      setStatus({ message: error instanceof Error ? error.message : "The loan could not be returned.", tone: "error" });
    } finally {
      setReturningId(null);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-5 py-10 sm:px-8">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--coral)]">Small library operations</p>
        <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">Library Loan Desk</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">A clear, compact way to lend books, track active loans, and calculate return fees fairly.</p>
      </header>
      <StatusMessage message={status?.message ?? null} tone={status?.tone ?? "success"} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <BookList books={books} />
        <LoanForm books={books} borrowerName={borrowerName} borrowerType={borrowerType} dueDate={dueDate} selectedBookId={selectedBookId} submitting={submitting} onBorrowerNameChange={setBorrowerName} onBorrowerTypeChange={setBorrowerType} onDueDateChange={setDueDate} onSelectedBookChange={setSelectedBookId} onSubmit={handleCreateLoan} />
      </div>
      <div className="mt-6"><LoanList loans={loans} returningId={returningId} onReturn={handleReturn} /></div>
      <footer className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]"><span>Standard late fee: $5/day</span><span>Student late fee: $2/day</span><span>Try a past due date to demo the fee.</span></footer>
    </main>
  );
}
