# HR-Policy

Production-oriented starter for a University of Wisconsin Oshkosh HR Policy Assistant.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- Framer Motion + lucide-react
- OpenAI Responses API integration point

## Key behaviors implemented
- Restricts answers to approved policy source registry.
- Applies source hierarchy (`federal > state > uw-system > uwo > department`).
- Returns structured statuses: `answer`, `uncertain`, `escalate`.
- Requires citations in response payload.
- Uses uncertainty/escalation fallback instead of guessing when evidence is weak/conflicting.

## Run
```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API
`POST /api/ask`

```json
{
  "question": "How does Wisconsin FMLA interact with federal FMLA?"
}
```
