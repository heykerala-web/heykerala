"use client"

import type React from "react"
import { useState } from "react"
import { MessageSquare, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { API_URL } from "@/lib/api"

export function ChatDock() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ id: string; role: "assistant" | "user"; content: string }[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        'Hi! I\'m your Kerala travel assistant. Ask me about places to visit, best times to travel, local cuisine, or help planning your itinerary. Try: "3-day itinerary for Munnar" or "Best beaches in Kerala".',
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const suggestedPrompts = [
    "Best time to visit Kerala?",
    "3-day Munnar itinerary",
    "Top beaches in Kerala",
    "Kerala food recommendations",
    "Backwater cruise options",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Context helper
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

    try {
      // Map history for API
      const history = messages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: history,
          context: getContext()
        }),
      })

      const data = await response.json()

      let aiContent = "I'm having a little trouble thinking clearly. Please try again! 🌴";
      if (data.reply) {
        aiContent = data.reply;
      }

      const reply = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: aiContent,
      }
      setMessages((prev) => [...prev, reply])
    } catch (error) {
      console.error("Chat error:", error)
      const errorReply = {
        id: Date.now().toString(),
        role: "assistant" as const,
        content: "Sorry, I'm having trouble connecting right now. 🌴",
      }
      setMessages((prev) => [...prev, errorReply])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Toggle button (shown when closed) */}
      {!open && (
        <button
          type="button"
          aria-label="Open AI chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="hidden sm:inline">Ask Hey Kerala</span>
        </button>
      )}

      {/* Docked panel */}
      {open && (
        <section
          aria-labelledby="ai-chat-title"
          className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[380px] md:w-[420px]"
        >
          <div className="flex h-[70vh] flex-col overflow-hidden rounded-xl border bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3 bg-emerald-50">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 id="ai-chat-title" className="text-sm font-semibold">
                    Kerala Travel Assistant
                  </h2>
                  <p className="text-xs text-gray-600">Online • AI Assistant</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close AI chat"
                onClick={() => setOpen(false)}
                className="rounded p-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === "assistant" ? (
                      <AssistantBubble>{message.content}</AssistantBubble>
                    ) : (
                      <UserBubble>{message.content}</UserBubble>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}

                {messages.length === 1 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Try these suggestions:</p>
                    <div className="space-y-1">
                      {suggestedPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => {
                            setInput(prompt)
                            handleSubmit({ preventDefault: () => { } } as any)
                          }}
                          className="block w-full text-left text-xs bg-gray-50 hover:bg-gray-100 rounded-md px-2 py-1 text-gray-700"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Kerala..."
                className="h-10"
                aria-label="Type your message"
                disabled={isLoading}
              />
              <Button type="submit" className="h-10" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      )}
    </>
  )
}

function AssistantBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1 h-6 w-6 shrink-0 rounded-full bg-emerald-600 text-white grid place-items-center text-xs font-bold">
        AI
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-sm text-gray-800">
        {children}
      </div>
    </div>
  )
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-emerald-600 px-3 py-2 text-sm text-white">
        {children}
      </div>
    </div>
  )
}
