import { useEffect, useRef } from "react"
import { MessageBubble } from "./MessageBubble"

export interface Message {
    id: string
    text: string
    sender: "user" | "agent"
    agentName?: string
}

interface ChatWindowProps {
    messages: Message[]
    isTyping?: boolean
    activeAgent: string
    greeting?: string
}

export function ChatWindow({ messages, isTyping, activeAgent, greeting }: ChatWindowProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isTyping])

    return (
        <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
            <div className="max-w-3xl mx-auto w-full flex flex-col min-h-full">
                {/* Empty State / Greeting */}
                {messages.length === 0 && greeting && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-100 mb-10 mt-20">
                        <h1 className="text-4xl font-serif text-gray-800 tracking-tight mb-4">
                            {greeting}
                        </h1>
                        <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-sm font-medium">Ready to assist with {activeAgent} insurance</span>
                        </div>
                    </div>
                )}

                {/* Messages Spacer to push content to bottom or keep top-aligned? 
                    Claude keeps messages top-aligned usually, or bottom-aligned. 
                    Let's stick to justify-end if we want bottom-up chat, or flex-1 for standard.
                    The user said "like claude", Claude centers the greeting until messages start.
                */}
                <div className={messages.length > 0 ? "flex flex-col space-y-4 pb-4" : "hidden"}>
                    {/* Greeting (Optional to show at top of chat history? usually no, it disappears) */}

                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            text={msg.text}
                            sender={msg.sender}
                            agentName={msg.agentName}
                        />
                    ))}

                    {isTyping && (
                        <div className="flex justify-start mb-4">
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 flex items-center gap-1 shadow-sm">
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
