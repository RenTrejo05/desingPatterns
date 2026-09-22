# Library Loan Desk: Technology and Design Pattern Justification

## Project Purpose

Library Loan Desk is a small web application for managing a library's books, active loans, returns, and late fees. The prototype focuses on a complete and understandable workflow: a user selects an available book, creates a loan, returns the book, and receives a late-fee calculation when the due date has passed.

The problem is intentionally small enough to demonstrate in five to seven minutes while still requiring meaningful separation between user interface, application coordination, database access, and business rules.

## Technology Choices

### Next.js

Next.js was selected because it provides both the user interface and server-side API routes in one project. The App Router makes it straightforward to place the main page in `app/page.tsx` and the HTTP endpoints in `app/api`. This keeps the prototype compact and makes the complete request flow easy to demonstrate.

Next.js also supports React components for the View and TypeScript server code for the Controllers and Repositories. Therefore, one framework is sufficient for the prototype without adding a separate frontend and backend framework.

### TypeScript

TypeScript was selected because the application works with several related domain values: books, loans, borrower types, dates, and fee amounts. Interfaces such as `Book` and `Loan` make those values explicit. The `BorrowerType` union restricts borrowers to `standard` or `student` and helps prevent invalid values.

TypeScript also makes the Strategy pattern clearer because both late-fee classes must implement the same `LateFeeStrategy` interface. This improves readability and makes the code easier to explain during the presentation.

### Tailwind CSS

Tailwind CSS was selected for simple, direct styling without introducing a separate component library. The interface needs to be clear rather than visually complex. Tailwind provides the layout, spacing, colors, form styling, availability labels, and responsive behavior needed for the prototype while keeping the styling close to the components that use it.

### SQLite and better-sqlite3

SQLite was selected because the application needs persistent book and loan data, but it does not require a remote database server or cloud deployment. The database is stored locally in a single file and is initialized automatically with five seeded books.

`better-sqlite3` provides the Node.js connection to SQLite. Database initialization is isolated in `repositories/Database.ts`, while book and loan SQL queries are isolated in the Repository classes. This is sufficient persistence for a university prototype and avoids the additional complexity of an ORM or an external database service.

## Design Pattern Choices

### MVC

MVC is used as the main architectural organization of the application.

The Model layer contains the domain types in `models/Book.ts` and `models/Loan.ts`. The View layer contains `app/page.tsx` and the React components in `components/`. These components display books, collect loan information, display active loans, and show operation results. They do not execute SQL or calculate late fees.

The Controller layer contains `controllers/BookController.ts` and `controllers/LoanController.ts`. Controllers validate input and coordinate the application workflow. The API routes are thin HTTP adapters: they receive requests, call a Controller, and return a response.

MVC fits this problem because the interface, request coordination, and domain data have different responsibilities. For example, the visual design could change without changing the loan validation rules, and the database implementation could change without rewriting the React components.

### Repository

The Repository pattern isolates database access. `BookRepository.ts` contains SQL operations for finding books and changing their availability. `LoanRepository.ts` contains SQL operations for finding active loans, creating loans, and recording returns. Controllers call methods such as `BookRepository.findById()` and `LoanRepository.markReturned()` instead of executing SQL directly.

This pattern fits because the library workflow needs data from two related tables. Without repositories, SQL statements would be mixed with validation and application coordination inside the Controllers. The Repository boundary makes the Controllers easier to read and makes it possible to replace SQLite later while keeping the rest of the application stable.

`Database.ts` is kept separate from the repositories. It opens the database, creates the tables, and inserts the initial seed data. It does not contain book or loan business queries.

### Strategy

The Strategy pattern is used specifically for late-fee calculation. The common interface is `LateFeeStrategy`, which defines `calculate(dueDate, returnDate)`. `StandardLateFeeStrategy` charges 500 cents, or $5, per late day. `StudentLateFeeStrategy` charges 200 cents, or $2, per late day.

When a loan is returned, `LoanController.returnLoan()` selects the strategy based on the borrower's type. It then calls the common `calculate()` method. The Controller coordinates the operation, but the fee formulas remain inside the concrete Strategy classes.

Strategy fits because the application has multiple valid fee policies for the same operation. It avoids putting separate formulas and conditional business rules throughout the Controller. A future policy, such as a teacher fee strategy, could be added without changing the Repository or the View.

## How the Patterns Work Together

The complete return workflow demonstrates all three patterns:

```text
View
  -> API route
  -> LoanController
  -> LoanRepository finds the loan
  -> LoanController selects a LateFeeStrategy
  -> Strategy calculates the fee
  -> LoanRepository stores the return and fee
  -> BookRepository makes the book available
  -> API response
  -> View refreshes
```

MVC organizes the application. Repository protects the database boundary. Strategy isolates the variable late-fee rule. Each pattern has a real responsibility and is used by the running prototype rather than existing only as a class name or folder name.

## Scope and Trade-offs

The prototype deliberately does not include authentication, user accounts, external services, cloud deployment, advanced search, or a full book-management CRUD interface. The assignment requires a functional prototype that demonstrates design patterns, not a complete production library system. Limiting the scope keeps the application reliable, understandable, and suitable for a five-to-seven-minute demonstration.

The main demonstration will show the seeded books, borrowing a book, the availability change, returning a book with a past due date, and the resulting late fee. The code demonstration will then show the MVC structure, the Repository SQL boundary, and both concrete late-fee Strategies.

## Conclusion

Next.js, TypeScript, and Tailwind CSS provide a compact web application stack, while SQLite provides simple local persistence. MVC, Repository, and Strategy were selected because each solves a concrete problem in this application: organizing responsibilities, isolating database access, and supporting different late-fee policies. Together they produce a small but functional prototype that is easy to run, test, and explain.
