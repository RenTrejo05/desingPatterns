import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Library Loan Desk",
  description: "A small library borrowing and returns prototype.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
