import { NextResponse } from "next/server";
import { BookController } from "@/controllers/BookController";

export async function GET() {
  try {
    return NextResponse.json(BookController.list());
  } catch {
    return NextResponse.json({ ok: false, error: "Books could not be loaded." }, { status: 500 });
  }
}
