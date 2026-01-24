import { useState, type KeyboardEvent, useRef, useEffect } from "react"
import { Send, Plus, X, Heart, Activity, Plane, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export type AgentType = "Life" | "Health" | "Travel" | "Investment"

interface ChatInputProps {
    onSendMessage: (message: string) => void
    disabled?: boolean
    activeAgent: AgentType
    onAgentChange: (agent: AgentType) => void
}

const agents = [
    { id: "Life", label: "Life", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
    { id: "Health", label: "Health", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: "Travel", label: "Travel", icon: Plane, color: "text-sky-500", bg: "bg-sky-50" },
    { id: "Investment", label: "Investment", icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50" },
] as const

export function ChatInput({ onSendMessage, disabled, activeAgent, onAgentChange }: ChatInputProps) {
    const [message, setMessage] = useState("")
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message)
            setMessage("")
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            if (showMenu) setShowMenu(false)
            handleSend()
        }
    }

    const getActiveAgentColor = () => {
        const agent = agents.find(a => a.id === activeAgent)
        return agent ? agent.color : "text-gray-600"
    }

    return (
        <div className="p-4 bg-white border-t border-gray-100 relative">
            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full right-4 mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20"
                    >
                        <div className="p-2 space-y-1">
                            <div className="text-xs font-semibold text-gray-400 px-2 py-1 uppercase tracking-wider">
                                Select Agent
                            </div>
                            {agents.map((agent) => {
                                const Icon = agent.icon
                                const isActive = activeAgent === agent.id
                                return (
                                    <button
                                        key={agent.id}
                                        onClick={() => {
                                            onAgentChange(agent.id as AgentType)
                                            setShowMenu(false)
                                        }}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                                            isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                                        )}
                                    >
                                        <div className={cn("p-1.5 rounded-md", agent.bg)}>
                                            <Icon className={cn("h-4 w-4", agent.color)} />
                                        </div>
                                        {agent.label}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-2 bg-gray-50 p-2 pl-4 rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">

                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Message ${activeAgent} Agent...`}
                    disabled={disabled}
                    className="flex-1 bg-transparent py-2 text-sm outline-none text-gray-800 placeholder:text-gray-400"
                />

                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowMenu(!showMenu)}
                        className={cn(
                            "h-8 w-8 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors shrink-0",
                            showMenu && "bg-gray-200 text-gray-800",
                            activeAgent && !showMenu && getActiveAgentColor()
                        )}
                        title="Switch Agent"
                    >
                        {showMenu ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>

                    <Button
                        onClick={handleSend}
                        disabled={!message.trim() || disabled}
                        size="icon"
                        className={cn(
                            "h-9 w-9 rounded-xl text-white shadow-sm transition-all shrink-0",
                            message.trim() ? "bg-blue-600 hover:bg-blue-700 hover:scale-105" : "bg-gray-300"
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
