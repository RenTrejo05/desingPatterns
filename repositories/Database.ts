import Database from "better-sqlite3";
import path from "node:path";

const databasePath = path.join(process.cwd(), "library-loan-desk.db");

export const database = new Database(databasePath);
database.pragma("foreign_keys = ON");

database.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    available INTEGER NOT NULL DEFAULT 1,
    UNIQUE (title, author)
  );

  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    borrower_name TEXT NOT NULL,
    borrower_type TEXT NOT NULL CHECK (borrower_type IN ('standard', 'student')),
    borrowed_at TEXT NOT NULL,
    due_date TEXT NOT NULL,
    returned_at TEXT,
    late_fee_cents INTEGER,
    FOREIGN KEY (book_id) REFERENCES books(id)
  );
`);

const bookCount = database.prepare("SELECT COUNT(*) AS count FROM books").get() as { count: number };

if (bookCount.count === 0) {
  const seedBook = database.prepare("INSERT OR IGNORE INTO books (title, author) VALUES (?, ?)");
  const seedBooks = database.transaction(() => {
    seedBook.run("The Pragmatic Programmer", "Andrew Hunt and David Thomas");
    seedBook.run("Clean Code", "Robert C. Martin");
    seedBook.run("Designing Data-Intensive Applications", "Martin Kleppmann");
    seedBook.run("Refactoring", "Martin Fowler");
    seedBook.run("The Mythical Man-Month", "Frederick P. Brooks Jr.");
  });
  seedBooks();
}
