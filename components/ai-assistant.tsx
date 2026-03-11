"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "./ui/button"

interface Message {
  role: "user" | "assistant"
  text: string
}

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm your Solar Farm AI. You can ask me about panel health or anything else!" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg = input.trim()
    setInput("")
    
    // Maintain full history for the backend
    const newMessages: Message[] = [...messages, { role: "user", text: userMsg }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMsg,
          history: messages.filter(m => m.text !== (messages[0]?.text)) // Filter out initial greeting if needed, or pass full
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { role: "assistant", text: data.response }])
      } else {
        const errorData = await response.json().catch(() => ({}))
        setMessages(prev => [...prev, { role: "assistant", text: errorData.response || "My neural links are fuzzy right now. Try again?" }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", text: "I couldn't establish a secure uplink to the farm." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[380px] h-[550px] bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_128px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                <Bot className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div>
                <span className="font-black text-foreground tracking-tight block">Solar Farm AI</span>
                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                  Neural Link Active
                </span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:bg-white/5 h-10 w-10 rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-gradient-to-b from-transparent to-background/40">
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-500`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-transform hover:scale-110 ${
                  msg.role === 'user' 
                    ? 'bg-primary/20 border-primary/20 text-primary' 
                    : 'bg-white/5 border-white/10 text-muted-foreground'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none shadow-xl shadow-primary/10 font-medium' 
                    : 'bg-white/5 border border-white/5 text-foreground rounded-tl-none font-medium backdrop-blur-md'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 flex-row animate-pulse">
                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="p-4 bg-white/5 border border-white/5 rounded-3xl rounded-tl-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-5 border-t border-white/5 bg-background/60 backdrop-blur-xl">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative group"
            >
              <input
                type="text"
                placeholder="Ask intelligence agent..."
                className="w-full bg-white/5 border border-white/10 text-sm rounded-2xl px-5 py-4 outline-none focus:border-primary/50 transition-all text-foreground pr-14 placeholder:text-muted-foreground/50 font-medium"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute right-2 top-2">
                <Button 
                  type="submit" 
                  size="icon" 
                  className="rounded-xl h-10 w-10 bg-primary text-primary-foreground hover:scale-105 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                  disabled={!input.trim() || isLoading}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-[24px] shadow-[0_20px_60px_-15px_rgba(34,197,94,0.5)] bg-primary hover:bg-primary/90 hover:scale-110 active:scale-90 transition-all text-primary-foreground animate-in zoom-in duration-500 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <MessageSquare className="w-7 h-7 relative z-10" />
        </Button>
      )}
    </div>
  )
}
