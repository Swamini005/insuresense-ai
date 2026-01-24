import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface MessageBubbleProps {
    text: string
    sender: "user" | "agent"
    agentName?: string
}

export function MessageBubble({ text, sender, agentName }: MessageBubbleProps) {
    const isUser = sender === "user"

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex w-full mb-4",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[80%] rounded-2xl px-5 py-3 shadow-sm",
                    isUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                )}
            >
                {!isUser && agentName && (
                    <div className="text-xs font-semibold text-blue-600 mb-1">
                        {agentName} Agent
                    </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{text}</div>
            </div>
        </motion.div>
    )
}
