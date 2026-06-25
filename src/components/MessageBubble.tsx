import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"

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
                {isUser ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{text}</div>
                ) : (
                    <div className="text-sm leading-relaxed text-gray-800 markdown-content">
                        <ReactMarkdown
                            components={{
                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-4 text-gray-900" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-md font-bold mb-2 mt-4 text-gray-900" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-3 text-gray-900" {...props} />,
                                a: ({node, ...props}) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                code: ({node, ...props}) => <code className="bg-gray-100 rounded px-1 py-0.5 text-xs font-mono" {...props} />
                            }}
                        >
                            {text}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
