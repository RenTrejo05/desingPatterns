import type { Book } from "@/models/Book";

export default function BookList({ books }: { books: Book[] }) {
  return (
    <section className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-sm">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--teal)]">Collection</p>
          <h2 className="mt-1 text-2xl font-bold">Books</h2>
        </div>
        <span className="rounded-full bg-[#e5f0ed] px-3 py-1 text-sm text-[var(--teal-dark)]">{books.filter((book) => book.available).length} available</span>
      </div>
      <div className="divide-y divide-[var(--line)]">
        {books.map((book) => (
          <div className="flex items-center justify-between gap-4 py-4" key={book.id}>
            <div>
              <p className="font-semibold">{book.title}</p>
              <p className="text-sm text-[var(--muted)]">{book.author}</p>
            </div>
            <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${book.available ? "bg-[#e5f0ed] text-[var(--teal-dark)]" : "bg-[#f6e4df] text-[#914337]"}`}>
              {book.available ? "Available" : "On loan"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
