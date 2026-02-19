
async function testChatEndpoint() {
    const url = "http://localhost:5000/api/ai/chat";
    console.log(`Testing Endpoint: ${url}`);

    const payload = {
        message: "Suggest 3 places in Kerala",
        history: [],
        context: {
            time: "Morning",
            location: "Kochi",
            weather: "Sunny"
        }
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const data = await response.json();

        console.log("Response Body:");
        if (data.error) {
            const match = data.error.match(/model: (gemini-[^ ]+)/);
            if (match) {
                console.log("CRITICAL: Error reports model:", match[1]);
            } else {
                console.log("Response Error (first 100 chars):", data.error.substring(0, 100));
            }
        }

    } catch (error) {
        console.error("❌ Request Failed:", error.message);
    }
}

testChatEndpoint();
