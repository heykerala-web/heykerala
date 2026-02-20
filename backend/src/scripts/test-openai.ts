import OpenAI from "openai";
console.log("OpenAI imported:", !!OpenAI);
const client = new OpenAI({ apiKey: "test" });
console.log("Client created");
process.exit(0);
