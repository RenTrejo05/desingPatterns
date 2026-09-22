import { NextRequest, NextResponse } from "next/server";
import { LoanController } from "@/controllers/LoanController";

export async function GET() {
  try {
    return NextResponse.json(LoanController.list());
  } catch {
    return NextResponse.json({ ok: false, error: "Loans could not be loaded." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = LoanController.create(await request.json());
    return NextResponse.json(result, { status: result.status });
  } catch {
    return NextResponse.json({ ok: false, error: "The loan could not be created." }, { status: 500 });
  }
}
