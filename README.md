# Library Loan Desk

Library Loan Desk is a small full-stack prototype for managing a library collection, active loans, book returns, and late fees. It is designed to demonstrate MVC, Repository, and Strategy in a functional web application.

## Technologies

### Web technologies

- Next.js 14.2.35 with the App Router
- TypeScript 5.5.4
- Tailwind CSS 3.4.10

### Database technology

- SQLite
- `better-sqlite3` 13.0.3

The SQLite database is stored locally in `library-loan-desk.db`. This generated file is ignored by Git.

## Design Patterns

### MVC

MVC separates the user interface, request/application coordination, and domain data types.

- Model: `models/Book.ts` and `models/Loan.ts` define the domain types at lines 1-6 and 1-20.
- View: `app/page.tsx` coordinates page state and user callbacks at lines 22-83. `components/BookList.tsx`, `components/LoanForm.tsx`, `components/LoanList.tsx`, and `components/StatusMessage.tsx` render the interface and collect input.
- Controller: `controllers/BookController.ts` delegates book listing at lines 1-7. `controllers/LoanController.ts` validates and coordinates loan workflows at lines 1-56.
- HTTP adapter: `app/api/books/route.ts`, `app/api/loans/route.ts`, and `app/api/loans/[id]/return/route.ts` remain thin and call Controllers.

The View never executes SQL. The Controller never renders React components or executes SQL. The Model layer contains domain types rather than HTTP code.

### Repository

The Repository pattern hides SQLite access from Controllers and Views.

- Database initialization and seed setup: `repositories/Database.ts`, lines 1-43.
- Book queries and availability updates: `repositories/BookRepository.ts`, lines 1-38.
- Loan queries, creation, and return updates: `repositories/LoanRepository.ts`, lines 1-66.

The Controllers call methods such as `BookRepository.findById`, `LoanRepository.create`, and `LoanRepository.markReturned`. SQL statements exist only in the repository files. `Database.ts` only opens/configures the database, creates tables, and seeds books.

### Strategy

The Strategy pattern makes late-fee policies interchangeable.

- Common interface and date helpers: `strategies/LateFeeStrategy.ts`, lines 1-16.
- Standard policy: `strategies/StandardLateFeeStrategy.ts`, lines 1-7. It charges 500 cents per late day ($5/day).
- Student policy: `strategies/StudentLateFeeStrategy.ts`, lines 1-7. It charges 200 cents per late day ($2/day).
- Strategy selection and use: `controllers/LoanController.ts`, lines 46-50.

The Controller selects a strategy based on the borrower type, but the multiplication formulas remain inside the concrete strategies.

## Project Structure

```text
app/
├── api/
│   ├── books/route.ts
│   └── loans/
│       ├── route.ts
│       └── [id]/return/route.ts
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── BookList.tsx
├── LoanForm.tsx
├── LoanList.tsx
└── StatusMessage.tsx

controllers/
├── BookController.ts
└── LoanController.ts

models/
├── Book.ts
└── Loan.ts

repositories/
├── Database.ts
├── BookRepository.ts
└── LoanRepository.ts

strategies/
├── LateFeeStrategy.ts
├── StandardLateFeeStrategy.ts
└── StudentLateFeeStrategy.ts
```

## Installation

Use Node.js 20 or newer for the current `better-sqlite3` release. From this project root, run:

```bash
npm install
```

## Running the Application

```bash
npm run dev
```

Open <http://localhost:3000> in a browser.

For a production validation:

```bash
npm run build
npm start
```

## How to Use

1. Review the five seeded books and their availability.
2. Choose an available book.
3. Enter a borrower name and select Standard or Student.
4. Choose a due date. Use a past date to demonstrate a late fee immediately.
5. Select **Create loan**. The book becomes unavailable and appears under Active loans.
6. Select **Return book**. The application calculates and stores the late fee, then makes the book available again.
7. Standard borrowers are charged $5 per late day. Student borrowers are charged $2 per late day.

## API Routes

- `GET /api/books` lists books and availability.
- `GET /api/loans` lists active loans.
- `POST /api/loans` creates a loan.
- `POST /api/loans/:id/return` returns a loan and calculates its fee.

## Pattern Demonstration

For the 5-7 minute presentation:

1. Show `app/page.tsx` and the components as the View.
2. Show `controllers/LoanController.ts` validating requests and coordinating the workflow.
3. Show `repositories/BookRepository.ts` and `repositories/LoanRepository.ts` to demonstrate that SQL is isolated from Controllers.
4. Show `strategies/LateFeeStrategy.ts`, `StandardLateFeeStrategy.ts`, and `StudentLateFeeStrategy.ts`.
5. Borrow a book, show its availability change, return it with a past due date, and show the fee.
6. Explain that MVC organizes the flow, Repository protects the database boundary, and Strategy lets the return workflow apply different fee policies.

## Assignment Notes

The instructor examples remain in `nextjs-design-patterns-prototypes-EN/` and were not modified. Part A analysis tables should remain in the separate assignment report. The separate 1-2 page Part B justification document is still required and should explain why these technologies and patterns fit the library-loan problem.
