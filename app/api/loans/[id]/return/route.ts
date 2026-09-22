import { NextResponse } from "next/server";
import { LoanController } from "@/controllers/LoanController";

type RouteContext = { params: { id: string } };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const result = LoanController.returnLoan(Number(context.params.id));
    return NextResponse.json(result, { status: result.status });
  } catch {
    return NextResponse.json({ ok: false, error: "The loan could not be returned." }, { status: 500 });
  }
}
