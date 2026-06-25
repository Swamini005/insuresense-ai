import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface SidebarProps {
    onNewChat: () => void
    isOpen: boolean
    onClose: () => void
    userName?: string
}

export function Sidebar({ onNewChat, isOpen, onClose, userName }: SidebarProps) {
    const displayName = userName || "Guest"
    const initials = displayName
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase() || "U"
    // Chat history backend is pending implementation
    const recentChats: any[] = []

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    {/* Backdrop for mobile only */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                        className="fixed md:static top-0 left-0 bottom-0 w-64 bg-[#f9f9f9] border-r border-gray-200 flex flex-col z-50 md:z-auto h-full shadow-xl md:shadow-none"
                    >
                        <div className="p-4 flex items-center justify-between">
                            <Button
                                onClick={() => {
                                    onNewChat()
                                }}
                                className="flex-1 justify-start gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm mr-2"
                                variant="ghost"
                            >
                                <Plus className="h-4 w-4" />
                                New Chat
                            </Button>
                            <Button onClick={onClose} size="icon" variant="ghost" className="md:hidden text-gray-400">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-2">
                            <div className="text-xs font-medium text-gray-500 px-3 py-2">
                                Recent
                            </div>
                            <div className="space-y-1">
                                {recentChats.length > 0 ? (
                                    recentChats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-200/50 transition-colors flex items-center gap-2 group"
                                        >
                                            <span className="truncate flex-1">{chat.title}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-xs text-gray-400 px-3 py-2 italic">
                                        No recent chats
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                            <div className="flex items-center gap-3 px-2">
                                <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                    {initials}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="text-sm font-medium text-gray-900 truncate">{displayName}</div>
                                    <div className="text-xs text-gray-500 truncate">Pro Plan</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
