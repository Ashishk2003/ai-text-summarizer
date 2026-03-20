# AI Text Summariser

A small CLI tool that accepts unstructured text and returns a structured summary using the OpenAI API.

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.example .env
# Then open .env and paste your OpenAI API key
```

---

## Usage

### Stdin (paste text directly)
```bash
node -r dotenv/config index.js
# Paste your text, then press Ctrl+D
```

### Single file
```bash
node -r dotenv/config index.js article.txt
```

### Batch — multiple files
```bash
node -r dotenv/config index.js file1.txt file2.txt file3.txt
```

### Custom output schema
```bash
node -r dotenv/config index.js article.txt --schema schema.example.json
```

---

## Example Output

```
──────────────────────────────────────────────────
📄 File: article.txt
──────────────────────────────────────────────────

📝 Summary
   OpenAI has released GPT-4o, a faster and cheaper multimodal model capable of reasoning across text, audio, and images in real time.

🔑 Key Points
   1. GPT-4o matches GPT-4 Turbo on text benchmarks while being twice as fast.
   2. The model supports real-time audio and vision input natively.
   3. GPT-4o will be available to free-tier ChatGPT users with usage limits.

💬 Sentiment   🟢 positive
🎯 Confidence  ✅ high

──────────────────────────────────────────────────
```

---

## Web UI

A minimal web interface is also included, served by Express.

```bash
npm run start:web
# Then open http://localhost:3000
```

Features:
- Paste text and click Analyse
- Custom schema via the expandable panel
- Live sentiment + confidence badges
- Token usage shown after each request

---

## Which API and Why

I used **OpenAI's GPT-4o mini** via the official `openai` Node.js SDK.

Reasons:
- GPT-4o mini is fast and cheap, which suits a short-turnaround CLI tool well
- The `openai` SDK is well-documented and handles retries and types cleanly
- JSON output reliability is strong with `temperature: 0.2`

---

## Prompt Design

The prompt does three things:

1. **Sets the role** — "You are a structured text analysis assistant" primes the model to treat this as a classification/extraction task rather than a conversational one.
2. **Provides the schema explicitly** — rather than describing fields in prose, I pass the schema as JSON so the model can mirror it directly. This reduces hallucinated field names.
3. **Hard rules in plain language** — `"Return ONLY valid JSON. No markdown, no explanation."` These constraints cut the most common failure modes (code fences, preamble text) without needing response format enforcement, which keeps the code compatible with any future schema.

Temperature is set to `0.2` — low enough for consistent structured output, but not zero, which can cause repetition issues.

---

## Custom Schema

You can pass any JSON schema file via `--schema`. The model will attempt to fill every field. The four core fields (`summary`, `key_points`, `sentiment`, `confidence`) should always be included; extra fields are printed under "Extra Fields" in the output.

See `schema.example.json` for an example with additional fields like `tone` and `target_audience`.

---

## What I'd Do With More Time

- **Structured output enforcement** — OpenAI supports `response_format: { type: "json_schema", ... }` for guaranteed schema compliance. I skipped it to keep schema handling flexible and the code short, but it would make the tool more robust in production.
- **Retry logic** — currently a failed API call exits immediately. Exponential backoff with 2–3 retries would handle transient failures gracefully.
- **Output formats** — a `--json` flag to write raw JSON to a file alongside the pretty terminal output, useful for piping into other tools.
- **Cost estimate** — log token usage after each call so the user can see what batch processing is costing them.
- **Tests** — a few unit tests around `buildPrompt` and `printResult`, and a mocked integration test for `analyseText`.

---

## Trade-offs and Shortcuts

| Decision | Reason |
|---|---|
| No `response_format` JSON mode | Keeps custom schema support simple; prompt constraints are sufficient for clean inputs |
| `gpt-4o-mini` not `gpt-4o` | Much cheaper for a demo tool; easy to swap via one line |
| No retry logic | Out of scope for a 1–2 hour task; documented above |
| `dotenv` loaded via `-r` flag, not in code | Keeps `index.js` free of setup boilerplate; clearly documented |
