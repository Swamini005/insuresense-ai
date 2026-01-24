import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { ChatWindow, type Message } from "@/components/ChatWindow"
import { ChatInput, type AgentType } from "@/components/ChatInput"
import { Navbar } from "@/components/Navbar"
import { Sidebar } from "@/components/Sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const MOCK_RESPONSES: Record<AgentType, string[]> = {
    Life: [
        "I can help you understand our term life insurance policies.",
        "Does your current plan cover critical illnesses?",
        "Reviewing your life coverage options is a great step for family security."
    ],
    Health: [
        "Are you looking for individual or family health floater plans?",
        "We have new potential add-ons for maternity coverage.",
        "Let me check the network hospitals in your city."
    ],
    Travel: [
        "Planning a trip soon? Verify your destination's visa insurance requirements.",
        "We offer coverage for flight delays and baggage loss.",
        "Domestic or International travel insurance?"
    ],
    Investment: [
        "Have you considered diversifying with ULIPs?",
        "Our guaranteed return plans are currently offering 7.2%.",
        "Let's assess your risk appetite for long-term growth."
    ]
}

export default function ChatPage() {
    const location = useLocation()
    const [activeAgent, setActiveAgent] = useState<AgentType>("Life")
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Initialize from navigation state if available
    useEffect(() => {
        if (location.state?.agent) {
            setActiveAgent(location.state.agent as AgentType)
        }
    }, [location.state])

    const handleSendMessage = (text: string) => {
        // Add user message
        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: "user"
        }
        setMessages(prev => [...prev, userMsg])
        setIsTyping(true)

        // Simulate agent response
        setTimeout(() => {
            const responses = MOCK_RESPONSES[activeAgent]
            const randomResponse = responses[Math.floor(Math.random() * responses.length)]

            const agentMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: "agent",
                agentName: activeAgent
            }

            setMessages(prev => [...prev, agentMsg])
            setIsTyping(false)
        }, 1500)
    }

    const handleAgentChange = (newAgent: AgentType) => {
        setActiveAgent(newAgent)
        if (messages.length > 0) {
            setMessages(prev => [
                ...prev,
                {
                    id: Date.now().toString(),
                    text: `Switched to ${newAgent} Agent.`,
                    sender: "agent",
                    agentName: newAgent
                }
            ])
        }
    }

    const handleNewChat = () => {
        setMessages([])
        setActiveAgent("Life")
        setIsSidebarOpen(false)
    }

    return (
        <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">
            {/* Navbar with Hamburger */}
            <div className="z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-gray-500 hover:bg-gray-100 md:mr-2"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Desktop Navbar - hidden on mobile */}
                <div className="hidden md:flex flex-1">
                    <Navbar />
                </div>

                {/* Mobile: Login/Signup buttons only */}
                <div className="flex md:hidden gap-2">
                    <Button variant="ghost" size="sm" className="text-sm">
                        Login
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        Sign up
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <Sidebar
                    onNewChat={handleNewChat}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <main className="flex-1 flex flex-col relative bg-white transition-all duration-300">
                    {/* Main Chat Content Area */}
                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <ChatWindow
                            messages={messages}
                            isTyping={isTyping}
                            activeAgent={activeAgent}
                            greeting="Good evening, Swamini"
                        />
                    </div>

                    {/* Input Area */}
                    <div className="flex-none max-w-3xl mx-auto w-full px-4 pb-6">
                        <ChatInput
                            onSendMessage={handleSendMessage}
                            disabled={isTyping}
                            activeAgent={activeAgent}
                            onAgentChange={handleAgentChange}
                        />
                        <p className="text-center text-xs text-gray-400 mt-2">
                            AI agents can make mistakes. Please verify important insurance details.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    )
}