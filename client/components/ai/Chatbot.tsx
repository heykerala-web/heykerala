"use client"

import * as React from "react"
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { API_URL } from "@/lib/api"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface Message {
    role: "user" | "model"
    parts: [{ text: string }]
    isNew?: boolean
}

// Sub-component for typing effect
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
    const [displayedText, setDisplayedText] = React.useState("")
    const [currentIndex, setCurrentIndex] = React.useState(0)

    React.useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + text[currentIndex])
                setCurrentIndex((prev) => prev + 1)
            }, 10) // Speed of typing
            return () => clearTimeout(timeout)
        } else if (onComplete) {
            onComplete()
        }
    }, [currentIndex, text, onComplete])

    return (
        <div className="markdown-content">
            <ReactMarkdown
                components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    h3: ({ children }) => <h3 className="font-bold text-base mb-1">{children}</h3>,
                    strong: ({ children }) => <strong className="font-bold text-accent dark:text-accent/90">{children}</strong>,
                }}
            >
                {displayedText}
            </ReactMarkdown>
        </div>
    )
}

export function Chatbot() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [message, setMessage] = React.useState("")
    const [chatHistory, setChatHistory] = React.useState<Message[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [isTyping, setIsTyping] = React.useState(false) // Visual thinking state
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Scroll to bottom on new messages or typing updates
    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    React.useEffect(() => {
        scrollToBottom()
    }, [chatHistory, isTyping])

    // Focus input when opening chat
    React.useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()

        if (!message.trim() || isLoading) return

        const userMsg = message.trim()
        setMessage("") // Clear input immediately

        const newHistory: Message[] = [...chatHistory, { role: "user", parts: [{ text: userMsg }] }]
        setChatHistory(newHistory)
        setIsLoading(true)
        setIsTyping(true)

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
                weather: "Sunny"
            }
        }

        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 800));

        try {
            const [response] = await Promise.all([
                fetch(`${API_URL}/ai/chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: userMsg,
                        history: newHistory.map(m => ({
                            role: m.role === 'user' ? 'user' : 'model',
                            parts: m.parts
                        })),
                        context: getContext()
                    }),
                }),
                minLoadingTime
            ]);

            const data = await response.json()

            setIsTyping(false);

            if (response.ok && data.reply) {
                // Mark as new for typewriter effect
                setChatHistory(prev => [...prev.map(m => ({ ...m, isNew: false })), { role: "model", parts: [{ text: data.reply }], isNew: true }])
            } else {
                console.error("Chat error:", data);
                const errorMessage = data.reply || data.message || "I'm having a little trouble thinking clearly. Please try again! 🌴";
                setChatHistory(prev => [...prev, { role: "model", parts: [{ text: errorMessage }], isNew: true }])
            }
        } catch (error) {
            console.error("Chat error:", error)
            setIsTyping(false);
            setChatHistory(prev => [...prev, { role: "model", parts: [{ text: "Sorry, I'm having trouble connecting right now. Please check your internet. 🌴" }], isNew: true }])
        } finally {
            setIsLoading(false)
            setIsTyping(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className={cn(
                    "mb-4 w-[350px] md:w-[450px] h-[600px] bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5",
                )}>
                    {/* Header */}
                    <div className="bg-accent p-6 text-white flex items-center justify-between shadow-lg relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-outfit font-bold text-lg">HeyKerala AI</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className={cn("w-2 h-2 rounded-full", isLoading ? "bg-yellow-400 animate-pulse" : "bg-green-400")} />
                                    <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">
                                        {isLoading ? "Thinking..." : "Online Assistant"}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 scroll-smooth">
                        {chatHistory.length === 0 && (
                            <div className="text-center py-10 px-4">
                                <div className="bg-accent/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="h-10 w-10 text-accent animate-pulse" />
                                </div>
                                <h4 className="font-outfit font-bold text-xl text-slate-800 dark:text-slate-200 mb-2">Welcome to Kerala! 🌴</h4>
                                <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
                                    I'm your AI travel guide. Ask me about destinations, food, festivals, or help planning your trip!
                                </p>
                            </div>
                        )}

                        {chatHistory.map((msg, i) => (
                            <div key={i} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
                                <div className={cn(
                                    "max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                    msg.role === "user"
                                        ? "bg-accent text-white rounded-tr-none"
                                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none"
                                )}>
                                    {msg.role === "model" && msg.isNew ? (
                                        <TypewriterText text={msg.parts[0].text} onComplete={scrollToBottom} />
                                    ) : msg.role === "model" ? (
                                        <div className="markdown-content">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                                    ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children} </ol>,
                                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                                    h3: ({ children }) => <h3 className="font-bold text-base mb-1">{children}</h3>,
                                                    strong: ({ children }) => <strong className="font-bold text-accent dark:text-accent/90">{children}</strong>,
                                                }}
                                            >
                                                {msg.parts[0].text}
                                            </ReactMarkdown>
                                        </div>
                                    ) : (
                                        msg.parts[0].text
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Thinking Indicator */}
                        {isTyping && (
                            <div className="flex items-start animate-in fade-in slide-in-from-left-2">
                                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-700 flex gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-accent/40 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative z-10">
                        <div className="relative group">
                            <Input
                                ref={inputRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask anything about Kerala..."
                                disabled={isLoading}
                                className="pr-14 py-7 rounded-2xl border-slate-200 dark:border-slate-800 focus-visible:ring-accent disabled:opacity-50 transition-all bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!message.trim() || isLoading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-accent hover:bg-accent/90 disabled:bg-slate-300 shadow-lg transition-transform active:scale-90"
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
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
                    "w-16 h-16 rounded-[2rem] shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 z-[100] group relative overflow-hidden",
                    isOpen ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900" : "bg-accent text-white"
                )}
            >
                <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
                {isOpen ? <X className="h-8 w-8 relative z-10" /> : <MessageCircle className="h-8 w-8 relative z-10" />}
            </Button>
        </div>
    )
}

