import { useEffect, useRef } from "react"
import { FileText } from "lucide-react"
import { MessageBubble } from "./MessageBubble"

import { ProductCard, type Product } from "./ProductCard"

export interface Message {
    id: string
    text: string
    sender: "user" | "agent"
    agentName?: string
    products?: Product[]
    report?: string
}

interface ChatWindowProps {
    messages: Message[]
    isTyping?: boolean
    activeAgent: string | null
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
                        {activeAgent && (
                            <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="text-sm font-medium">Ready to assist with {activeAgent} insurance</span>
                            </div>
                        )}
                    </div>
                )}

                <div className={messages.length > 0 ? "flex flex-col space-y-4 pb-4" : "hidden"}>
                    {messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col">
                            <MessageBubble
                                text={msg.text}
                                sender={msg.sender}
                                agentName={msg.agentName}
                            />
                            {msg.products && msg.products.length > 0 && (
                                <div className="ml-4 mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-2 max-w-2xl">
                                    {msg.products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            )}
                            {msg.report && (
                                <div className="ml-4 mt-3 max-w-2xl bg-purple-50/60 border border-purple-100 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3 text-purple-700">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Breakthrough Report</span>
                                    </div>
                                    <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                                        {msg.report}
                                    </div>
                                </div>
                            )}
                        </div>
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
