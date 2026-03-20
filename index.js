import fetch from "node-fetch";

const API_KEY = "YOUR_API_KEY_HERE";

async function summarize(text) {
  if (!text || text.trim() === "") {
    console.log("Error: Empty input");
    return;
  }

  const prompt = `
Return JSON:
{
  "summary": "",
  "key_points": ["", "", ""],
  "sentiment": ""
}

Text:
${text}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });

    const data = await response.json();

    console.log("\n===== RESULT =====\n");
    console.log(data.choices[0].message.content);

  } catch (error) {
    console.log("API Error:", error.message);
  }
}

// Example input (since no terminal on phone)
const inputText = `
The product is very useful and saves a lot of time. Many users are happy with its performance, but some think it is expensive.
`;

summarize(inputText);
