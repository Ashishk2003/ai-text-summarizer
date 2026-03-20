import fs from "fs";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get input (file or stdin)
async function getInput() {
  const filePath = process.argv[2];

  if (filePath) {
    return fs.readFileSync(filePath, "utf-8");
  }

  return new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", chunk => data += chunk);
    process.stdin.on("end", () => resolve(data));
  });
}

// Call AI
async function summarize(text) {
  if (!text || text.trim() === "") {
    throw new Error("Input text is empty");
  }

  const prompt = `
Return ONLY JSON in this format:
{
  "summary": "one sentence summary",
  "key_points": ["point1", "point2", "point3"],
  "sentiment": "positive | neutral | negative"
}

Text:
${text}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

// Run
(async () => {
  try {
    const inputText = await getInput();
    const result = await summarize(inputText);

    console.log("\n===== RESULT =====\n");

    // Pretty print
    const parsed = JSON.parse(result);

    console.log("Summary:", parsed.summary);
    console.log("\nKey Points:");
    parsed.key_points.forEach((p, i) => console.log(`${i + 1}. ${p}`));
    console.log("\nSentiment:", parsed.sentiment);

  } catch (error) {
    console.error("Error:", error.message);
  }
})();
