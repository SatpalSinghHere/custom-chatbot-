import 'dotenv/config'
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY as string,
  defaultHeaders: {
    // "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
    // "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
  },
});
async function main() {
  const completion = await openai.chat.completions.create({
    model: "nvidia/llama-3.1-nemotron-nano-8b-v1:free",
    messages: [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    
  });

  console.log(completion.choices[0].message);
}

main();