"use client";

import { useState } from "react";
import { Send, Sparkles, AlertCircle } from "lucide-react";

export default function GeminiChat() {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setError(null);

        try {
            // Call the Express backend via Next.js rewrite
            // Rewrites in next.config.mjs map /api/:path* -> http://localhost:5000/api/:path*
            // Backend maps aiRoutes to /api/ai
            // So URL is /api/ai/chat
            const response = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    history: messages,
                    message: input,
                    context: {
                        time: new Date().toLocaleTimeString(),
                        location: "User Browser", // Can be dynamic if needed
                        weather: "Unknown"
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Show real error from backend as requested
                throw new Error(data.realError || data.message || "Failed to fetch response");
            }

            const assistantMessage = { role: "assistant", content: data.reply };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (err: any) {
            console.error("Chat Error:", err);
            setError(err.message || "Something went wrong");
            // Optionally add a system message to history to show error in chat
            setMessages((prev) => [
                ...prev,
                { role: "system", content: `Error: ${err.message || "Failed to get response"}` }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border rounded-2xl overflow-hidden bg-background shadow-xl">
            <div className="bg-primary p-4 text-primary-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h2 className="font-bold">Hey Kerala AI</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground mt-10">
                        <p>👋 Hi! I can help you plan your Kerala trip.</p>
                        <p className="text-sm">Ask me about places, food, or hotels!</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-br-none"
                                : msg.role === "system"
                                    ? "bg-destructive/10 text-destructive border border-destructive/20"
                                    : "bg-muted text-foreground rounded-bl-none"
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-destructive text-sm p-2 bg-destructive/10 rounded-lg justify-center">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-card">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Ask anything..."
                        className="flex-1 bg-muted px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading || !input.trim()}
                        className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
