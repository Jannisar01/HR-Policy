import OpenAI from "openai";
import type { PolicyAnswer } from "@/lib/types/policy";

export async function optionallyRefineResponse(answer: PolicyAnswer): Promise<PolicyAnswer> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return answer;
  }

  const client = new OpenAI({ apiKey });
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "Rewrite policy answers for internal HR assistant UX. Preserve meaning, status, and citations; do not invent facts."
      },
      {
        role: "user",
        content: JSON.stringify(answer)
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "policy_answer",
        schema: {
          type: "object",
          properties: {
            status: { type: "string", enum: ["answer", "escalate", "uncertain"] },
            answer: { type: "string" },
            rationale: { type: "string" }
          },
          required: ["status", "answer", "rationale"],
          additionalProperties: false
        }
      }
    }
  });

  const parsed = JSON.parse(response.output_text) as Pick<
    PolicyAnswer,
    "status" | "answer" | "rationale"
  >;

  return {
    ...answer,
    status: parsed.status,
    answer: parsed.answer,
    rationale: parsed.rationale
  };
}
