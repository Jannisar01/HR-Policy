import { NextResponse } from "next/server";
import { z } from "zod";
import { retrieveApprovedPolicyEvidence } from "@/lib/policy/retrieval";
import { buildPolicyAnswer } from "@/lib/policy/answering";
import { optionallyRefineResponse } from "@/lib/llm/responses";

const requestSchema = z.object({
  question: z.string().min(5)
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const evidence = await retrieveApprovedPolicyEvidence(parsed.data.question);
  const answer = buildPolicyAnswer(parsed.data.question, evidence);
  const refined = await optionallyRefineResponse(answer);

  return NextResponse.json({ data: refined });
}
