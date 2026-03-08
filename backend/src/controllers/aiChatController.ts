import { Request, Response } from "express";
import https from "https";
import fs from "fs";

export const chatWithAI = async (req: Request, res: Response) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("AI Configuration Error: OPENROUTER_API_KEY is missing");
            return res.status(500).json({ message: "OpenRouter API key not configured" });
        }

        // 3. Extract the user message from the request body (`req.body.message`).
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        const systemPrompt = "You are a helpful Kerala tourism assistant.";

        // Process history to ensure it strictly follows alternating user/assistant roles
        // and filter out 'system' or 'error' objects which OpenRouter rejects.
        const formattedHistory = (history || [])
            .filter((msg: any) => msg.role !== "system" && msg.role !== "error")
            .map((msg: any) => ({
                role: msg.role === "model" ? "assistant" : msg.role,
                content: msg.content || ""
            }));

        // 1. The request body sent to OpenRouter must follow the correct structure
        const messages = [
            { role: "system", content: systemPrompt },
            ...formattedHistory,
            // Latest user message
            { role: "user", content: message }
        ];

        const requestBody = JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: messages,
            max_tokens: 500, // Optional: reasonable safety limit for generated tokens
            temperature: 0.7
        });

        // 2. Ensure the request uses the correct headers
        const options = {
            hostname: "openrouter.ai",
            path: "/api/v1/chat/completions",
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(requestBody)
            }
        };

        const makeRequest = () => new Promise((resolve, reject) => {
            const apiReq = https.request(options, (apiRes) => {
                let data = "";

                apiRes.on("data", (chunk) => {
                    data += chunk;
                });

                apiRes.on("end", () => {
                    try {
                        const jsonResponse = JSON.parse(data);
                        resolve({ statusCode: apiRes.statusCode, data: jsonResponse });
                    } catch (e) {
                        reject(new Error("Failed to parse OpenRouter response"));
                    }
                });
            });

            apiReq.on("error", (e) => reject(e));

            // Set a timeout of 10 seconds to handle slow unresponsive OpenRouter endpoints
            apiReq.setTimeout(10000, () => {
                apiReq.abort();
                reject(new Error("OpenRouter timeout"));
            });

            apiReq.write(requestBody);
            apiReq.end();
        });

        const apiResponse: any = await makeRequest();
        const { statusCode, data } = apiResponse;

        if (statusCode && statusCode >= 400) {
            console.error("OpenRouter API Error:", JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || data.message || "OpenRouter error");
        }

        // 4. Return the AI response safely using response.data.choices[0].message.content
        const reply = data.choices?.[0]?.message?.content;

        if (!reply) {
            console.error("Invalid OpenRouter Response:", JSON.stringify(data, null, 2));
            throw new Error("Invalid response format from OpenRouter");
        }

        // 6. Ensure the endpoint always returns a valid JSON response
        return res.status(200).json({ reply });

    } catch (error: any) {
        // 7. Make the code production-safe with try/catch and clear error logging
        console.error("Chat Controller Error:", error);

        try {
            fs.appendFileSync(
                "error.log",
                `[${new Date().toISOString()}] AI Chat Error: ${error.stack || error.message}\n`
            );
        } catch (e) {
            console.error("Failed to write to error log", e);
        }

        // 5. Add proper error handling for OpenRouter API failures/timeouts to return a fallback response
        const fallbackResponse = "Sorry, AI service is temporarily unavailable. Here are some suggested places in Kerala: Munnar, Wayanad, Alleppey, and Kochi.";

        return res.status(200).json({
            reply: fallbackResponse,
            isFallback: true,       // Helpful flag for frontend telemetry
            realError: error.message
        });
    }
};
