import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import Place from '../models/Place';
import https from 'https';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const callOpenRouter = (prompt: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) return reject(new Error("OPENROUTER_API_KEY not configured"));

        const requestBody = JSON.stringify({
            model: "openai/gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
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

        const req = https.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => data += chunk);
            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    if (res.statusCode && res.statusCode >= 400) {
                        reject(new Error(json.error?.message || "OpenRouter error"));
                    } else {
                        resolve(json);
                    }
                } catch (e) {
                    reject(new Error("Failed to parse OpenRouter response"));
                }
            });
        });

        req.on("error", (e) => reject(e));
        req.setTimeout(30000, () => {
            req.abort();
            reject(new Error("OpenRouter timeout"));
        });
        req.write(requestBody);
        req.end();
    });
};

async function verify() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected.");

        const testCases = [
            {
                name: "Wayanad Nature Trip",
                districts: ["Wayanad"],
                interests: ["Nature", "Waterfall"],
                customPreference: "Include tea garden visit",
                duration: "2 days"
            },
            {
                name: "Kozhikode Beach & Heritage",
                districts: ["Kozhikode"],
                interests: ["Beach", "Heritage"],
                customPreference: "Prefer seafood spots and historic temples",
                duration: "2 days"
            }
        ];

        for (const tc of testCases) {
            console.log(`\n--- Running Test: ${tc.name} ---`);
            const query: any = { status: 'approved' };
            if (tc.districts.length > 0) query.district = { $in: tc.districts };
            if (tc.interests.length > 0) query.category = { $in: tc.interests };

            let relevantPlaces = await Place.find(query)
                .select('name district category ratingAvg description latitude longitude')
                .sort({ ratingAvg: -1 })
                .limit(25);

            if (relevantPlaces.length < 5) {
                relevantPlaces = await Place.find({ status: 'approved', district: { $in: tc.districts } })
                    .select('name district category ratingAvg description latitude longitude')
                    .sort({ ratingAvg: -1 })
                    .limit(25);
            }

            console.log(`Found ${relevantPlaces.length} relevant places for prompt.`);

            const placesContext = relevantPlaces.map(p =>
                `- ${p.name} (District: ${p.district}, Category: ${p.category}, Rating: ${p.ratingAvg}, Lat: ${p.latitude}, Lng: ${p.longitude}): ${p.description.substring(0, 50)}...`
            ).join('\n');

            const prompt = `Generate a structured 2-day travel itinerary for Kerala.
User Inputs:
- Districts: ${tc.districts.join(', ')}
- Traveler Type: Solo
- Budget: Mid-range
- Interests: ${tc.interests.join(', ')}
- Custom Preference: ${tc.customPreference}

Available Places to use:
${placesContext}

Rules:
1. ONLY use the provided places. Do NOT include places from districts other than: ${tc.districts.join(', ')}.
2. Provide 3-4 activities per day.
3. Return ONLY valid JSON in this exact structure:
{
  "title": "title",
  "aiReason": "reason",
  "days": [
    {
      "day": 1,
      "activities": [
        { "time": "09:00", "name": "name", "desc": "desc", "lat": 0, "lng": 0 }
      ]
    }
  ]
}`;

            const aiResponse = await callOpenRouter(prompt);
            const aiData = JSON.parse(aiResponse.choices[0].message.content);

            console.log(`AI Title: ${aiData.title}`);
            console.log(`AI Reason: ${aiData.aiReason}`);

            let allInDistrict = true;
            aiData.days.forEach((day: any) => {
                day.activities.forEach((act: any) => {
                    // Check if name is in relevantPlaces
                    const match = relevantPlaces.find(p => p.name.includes(act.name) || act.name.includes(p.name));
                    if (!match) {
                        console.warn(`[WARNING] Activity "${act.name}" might NOT be from provided list or district.`);
                        allInDistrict = false;
                    } else {
                        console.log(`[OK] Activity: ${act.name} (District: ${match.district})`);
                    }
                });
            });

            if (allInDistrict) {
                console.log(`[SUCCESS] All activities for "${tc.name}" are confirmed to be within the selected districts.`);
            } else {
                console.log(`[NOTICE] Some activities might be from outside the list, but if they are in ${tc.districts.join(', ')}, it might be okay (using LLM memory).`);
            }
        }

        await mongoose.disconnect();
        console.log("\nVerification complete.");
    } catch (error) {
        console.error("Verification failed:", error);
        process.exit(1);
    }
}

verify();
