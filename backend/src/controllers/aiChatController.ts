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

        const { message, history, context } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required" });
        }

        // Construct messages array for OpenRouter
        const systemPrompt = "You are a Kerala tourism assistant. You help users plan trips, recommend places, hotels, and events in Kerala, India. Keep responses concise and friendly.";

        const messages = [
            { role: "system", content: systemPrompt },
            ...(history || []).map((msg: any) => ({
                role: msg.role === "model" ? "assistant" : msg.role,
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        const requestBody = JSON.stringify({
            model: "mistralai/mistral-7b-instruct",
            messages: messages,
            max_tokens: 300,
            temperature: 0.7
        });

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
                        reject(new Error("Failed to parse OpenRouter response: " + data.substring(0, 100)));
                    }
                });
            });

            apiReq.on("error", (e) => {
                reject(e);
            });

            apiReq.write(requestBody);
            apiReq.end();
        });

        const apiResponse: any = await makeRequest();
        const { statusCode, data } = apiResponse;

        if (statusCode && statusCode >= 400) {
            console.error("OpenRouter API Error:", JSON.stringify(data, null, 2));
            return res.status(statusCode).json({
                message: "AI error",
                realError: data.error?.message || data.message || "Unknown OpenRouter error"
            });
        }

        const reply = data.choices?.[0]?.message?.content;

        if (!reply) {
            console.error("Invalid OpenRouter Response:", JSON.stringify(data, null, 2));
            return res.status(500).json({ message: "AI error", realError: "Invalid response format from OpenRouter" });
        }

        return res.status(200).json({ reply });

    } catch (error: any) {
        console.error("Chat Controller Error:", error);
        try {
            fs.appendFileSync("error.log", `[${new Date().toISOString()}] ${error.stack || error.message}\n`);
        } catch (e) {
            console.error("Failed to write to error log", e);
        }
        return res.status(500).json({
            message: "AI error",
            realError: error.message
        });
    }
};
