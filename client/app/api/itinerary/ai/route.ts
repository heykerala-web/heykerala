import { NextResponse } from "next/server";

export const maxDuration = 60; // Allow longer generation times

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const rawBackendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const backendBase = rawBackendUrl.replace(/\/api\/?$/, '');

        const response = await fetch(`${backendBase}/api/itinerary/ai`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("AI Itinerary Error:", error);
        return new NextResponse(JSON.stringify({ error: error.message || "Failed to generate plan" }), {
            status: 500,
        });
    }
}
