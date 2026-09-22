import { database } from "./Database";
import type { Book } from "@/models/Book";

type BookRow = {
  id: number;
  title: string;
  author: string;
  available: number;
};

function toBook(row: BookRow): Book {
  return { ...row, available: row.available === 1 };
}

export const BookRepository = {
  findAll(): Book[] {
    const rows = database.prepare("SELECT id, title, author, available FROM books ORDER BY title").all() as BookRow[];
    return rows.map(toBook);
  },

  findById(id: number): Book | null {
    const row = database.prepare("SELECT id, title, author, available FROM books WHERE id = ?").get(id) as BookRow | undefined;
    return row ? toBook(row) : null;
  },

  findAvailable(): Book[] {
    const rows = database.prepare("SELECT id, title, author, available FROM books WHERE available = 1 ORDER BY title").all() as BookRow[];
    return rows.map(toBook);
  },

  markUnavailable(bookId: number): void {
    database.prepare("UPDATE books SET available = 0 WHERE id = ?").run(bookId);
  },

  markAvailable(bookId: number): void {
    database.prepare("UPDATE books SET available = 1 WHERE id = ?").run(bookId);
  },
};
