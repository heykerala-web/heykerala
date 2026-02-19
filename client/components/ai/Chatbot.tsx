"use client"

import * as React from "react"
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { API_URL } from "@/lib/api"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "model"
    parts: [{ text: string }]
}

export function Chatbot() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [chatHistory, setChatHistory] = React.useState<Message[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [chatHistory, isLoading])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!message.trim() || isLoading) return

        const userMsg = message.trim()
        setMessage("")
        const newHistory: Message[] = [...chatHistory, { role: "user", parts: [{ text: userMsg }] }]
        setChatHistory(newHistory)
        setIsLoading(true)

        const getContext = () => {
            const hour = new Date().getHours();
            let time = "Daytime";
            if (hour < 12) time = "Morning";
            else if (hour < 17) time = "Afternoon";
            else if (hour < 21) time = "Evening";
            else time = "Night";

            return {
                time,
                location: "Kerala",
                weather: "Sunny" // Default or fetched
            }
        }

        try {
            const response = await fetch(`${API_URL}/ai/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: chatHistory,
                    context: getContext()
                }),
            })

            const data = await response.json()
            if (data.reply) {
                setChatHistory([...newHistory, { role: "model", parts: [{ text: data.reply }] }])
            } else {
                console.error("Chat error: Unexpected response", data)
                const errorMessage = data.message + (data.error ? `: ${data.error}` : "") || "I'm having a little trouble thinking clearly. Please try again! 🌴";
                setChatHistory([...newHistory, { role: "model", parts: [{ text: errorMessage }] }])
            }
        } catch (error) {
            console.error("Chat error:", error)
            setChatHistory([...newHistory, { role: "model", parts: [{ text: "Sorry, I'm having trouble connecting right now. 🌴" }] }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className={cn(
                    "mb-4 w-[350px] md:w-[400px] h-[500px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5",
                )}>
                    {/* Header */}
                    <div className="bg-accent p-6 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-outfit font-bold">HeyKerala AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Online Assistant</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                        {chatHistory.length === 0 && (
                            <div className="text-center py-10 px-4">
                                <div className="bg-accent/10 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                    <Sparkles className="h-8 w-8 text-accent" />
                                </div>
                                <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-200 mb-2">Welcome to Kerala! 🌴</h4>
                                <p className="text-sm text-muted-foreground">
                                    I'm your AI travel guide. Ask me about destinations, food, festivals, or help planning your trip!
                                </p>
                            </div>
                        )}
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.role === "user"
                                        ? "bg-accent text-white rounded-tr-none"
                                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-tl-none"
                                )}>
                                    {msg.parts[0].text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700">
                                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                        <div className="relative">
                            <Input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask anything about Kerala..."
                                className="pr-12 py-6 rounded-2xl border-slate-200 dark:border-slate-800 focus-visible:ring-accent"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!message.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-accent hover:bg-accent/90"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "w-16 h-16 rounded-3xl shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95",
                    isOpen ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900" : "bg-accent text-white"
                )}
            >
                {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
            </Button>
        </div>
    )
}
