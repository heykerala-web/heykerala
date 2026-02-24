// @ts-nocheck
import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import AIRecommendCache from "../models/AIRecommendCache";
import Place from "../models/Place";
import https from "https";
import fs from "fs";

// Helper to escape special characters for regex
const escapeRegex = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};


export const getRecommendations = async (req: AuthRequest, res: Response) => {
    try {
        const { weather } = req.query; // e.g. "Rainy", "Sunny", "Hot"
        const category = (req.query.category as string) || "General";
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error("AI Configuration Error: OPENROUTER_API_KEY is missing");
            return res.status(500).json({ message: "OpenRouter API key not configured" });
        }

        // 1. Check Cache
        const cacheKey = `${category}-${weather || "General"}`;
        const cached = await AIRecommendCache.findOne({ category: cacheKey });

        if (cached) {
            return res.status(200).json(cached.result);
        }

        // 2. Call OpenRouter
        const dbPlaces = await Place.find({ status: "approved" }, "name");
        const validPlaces = dbPlaces.map(p => p.name);

        if (validPlaces.length === 0) {
            return res.status(200).json([]);
        }

        const prompt = `
        Recommend 5 unique travel destinations in Kerala, India for this context:
        Category: ${category}
        Weather: ${weather || "Any"}

        IMPORTANT: ONLY recommend places from this exact list:
        ${validPlaces.join(", ")}

        Respond strictly with a JSON object in this format:
        {
          "recommendations": [
            {
                "name": "One of the exact names from the list above",
                "category": "The actual category",
                "district": "The actual district",
                "image": "",
                "ratingAvg": 4.8
            }
          ]
        }
        Leave the "image" field as an empty string "". The system will handle the imaging.
        Do not include any other text or explanation.
        `;

        const requestBody = JSON.stringify({
            model: "google/gemini-2.0-flash-001",
            messages: [
                { role: "system", content: "You are a Kerala tourism expert. You strictly output JSON objects containing travel recommendations based ONLY on the provided list." },
                { role: "user", content: prompt }
            ],
            max_tokens: 1000,
            temperature: 0.7,
            response_format: { type: "json_object" }
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
                apiRes.on("data", (chunk) => { data += chunk; });
                apiRes.on("end", () => {
                    try {
                        const jsonResponse = JSON.parse(data);
                        resolve({ statusCode: apiRes.statusCode, data: jsonResponse });
                    } catch (e) {
                        reject(new Error("Failed to parse OpenRouter response: " + data.substring(0, 100)));
                    }
                });
            });

            apiReq.on("error", (e) => { reject(e); });
            apiReq.write(requestBody);
            apiReq.end();
        });

        const apiResponse: any = await makeRequest();
        const { statusCode, data } = apiResponse;

        if (statusCode && statusCode >= 400) {
            console.error("OpenRouter Recommendation API Error:", JSON.stringify(data, null, 2));
            return res.status(statusCode).json({
                message: "AI recommendation error",
                realError: data.error?.message || data.message || "Unknown OpenRouter error"
            });
        }

        const rawContent = data.choices?.[0]?.message?.content;
        if (!rawContent) {
            throw new Error("Invalid response format from OpenRouter (no content)");
        }

        let recommendations = [];
        try {
            const jsonStr = rawContent.replace(/```json|```/g, "").trim();
            const parsed = JSON.parse(jsonStr);

            if (Array.isArray(parsed)) {
                recommendations = parsed;
            } else if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
                recommendations = parsed.recommendations;
            } else if (parsed.destinations && Array.isArray(parsed.destinations)) {
                recommendations = parsed.destinations;
            } else {
                const firstArray = Object.values(parsed).find(v => Array.isArray(v));
                if (firstArray) recommendations = firstArray as any[];
            }

            // 3. Match with database and enhance
            const enhancedRecommendations = await Promise.all(recommendations.map(async (item) => {
                try {
                    // Robust Matching Logic
                    const cleanItemName = item.name.replace(/\([^)]*\)/g, '').trim();
                    const words = cleanItemName.split(/\s+/).filter(w => w.length > 2);

                    const dbPlace = await Place.findOne({
                        $or: [
                            { name: { $regex: new RegExp(`^${escapeRegex(item.name)}$`, 'i') } },
                            { name: { $regex: new RegExp(`^${escapeRegex(cleanItemName)}$`, 'i') } },
                            { name: { $regex: new RegExp(`${escapeRegex(cleanItemName)}`, 'i') } },
                            // Match if first word is significant
                            ...(words.length > 0 ? [{ name: { $regex: new RegExp(`^${escapeRegex(words[0])}`, 'i') } }] : [])
                        ]
                    });

                    if (dbPlace) {
                        return {
                            ...item,
                            name: dbPlace.name, // Use the official name
                            _id: dbPlace._id,
                            image: dbPlace.image || (dbPlace.images && dbPlace.images[0]) || item.image,
                            category: dbPlace.category || item.category,
                            district: dbPlace.district || item.district,
                            ratingAvg: dbPlace.ratingAvg || item.ratingAvg
                        };
                    }

                    // If NO match found, we skip this item to avoid broken links (filtered below)
                    return null;
                } catch (err) {
                    console.error("Match error for:", item.name, err);
                    return null;
                }
            }));

            // Filter out nulls (failed matches)
            recommendations = enhancedRecommendations.filter(r => r !== null);

        } catch (e) {
            console.error("Failed to parse recommendations JSON:", rawContent);
            return res.status(500).json({
                message: "AI generation failed to produce valid JSON",
                detail: rawContent,
                error: (e as Error).message
            });
        }

        // 3. Save to Cache
        await AIRecommendCache.findOneAndUpdate(
            { category: cacheKey },
            { result: recommendations },
            { upsert: true, new: true }
        );

        res.status(200).json(recommendations);

    } catch (error: any) {
        console.error("AI Recommendation Error:", error);
        try {
            fs.appendFileSync("error.log", `[${new Date().toISOString()}] REC-ERROR: ${error.stack || error.message}\n`);
        } catch (e) { }

        res.status(500).json({ message: "Failed to fetch recommendations", error: error.message });
    }
};
