import { useState, useEffect } from "react"
import { useLocation, Link, useNavigate } from "react-router-dom"
import { ChatWindow, type Message } from "@/components/ChatWindow"
import { ChatInput, type AgentType } from "@/components/ChatInput"
import { DashboardNavbar } from "@/components/DashboardNavbar"
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
    const navigate = useNavigate()
    const location = useLocation()
    const [activeAgent, setActiveAgent] = useState<AgentType | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Initialize from navigation state if available
    useEffect(() => {
        if (location.state?.agent) {
            const agent = location.state.agent as AgentType
            if (agent === "Travel") {
                navigate("/travel-insurance", { replace: true })
                return
            }
            if (agent === "Health") {
                navigate("/health-insurance", { replace: true })
                return
            }
            if (agent === "Life") {
                navigate("/life-insurance", { replace: true })
                return
            }
            if (agent === "Investment") {
                navigate("/investment-insurance", { replace: true })
                return
            }
            setActiveAgent(agent)
        }
    }, [location.state, navigate])

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return

        const newUserMsg: Message = {
            id: Date.now().toString(),
            text: text,
            sender: "user",
        }

        setMessages((prev) => [...prev, newUserMsg])
        setIsTyping(true)

        try {
            let endpoint = "http://localhost:4000/api/chat"
            if (activeAgent === "Life") endpoint = "http://localhost:4000/api/life/lifeagent"
            else if (activeAgent === "Health") endpoint = "http://localhost:4000/api/health/healthagent"
            else if (activeAgent === "Travel") endpoint = "http://localhost:4000/api/travel/travelagent"
            else if (activeAgent === "Investment") endpoint = "http://localhost:4000/api/investment/investmentagent"

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query: text }),
            })

            if (!response.ok) {
                throw new Error("Failed to get response")
            }

            const data = await response.json()

            // Generic chat returns { response: string }
            // Specific agents return { text: string, sources: ... } or sometimes { response: string } depending on verification (Health returned { response }, Investment { text })
            // Let's handle both.
            // Generic chat returns { response: string }
            // Specific agents return { text: string, products: [], sources: ... }
            const responseText = data.response || data.text || "Sorry, I couldn't process that."
            const products = data.products || []

            const agentResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: "agent",
                agentName: activeAgent || "Assistant",
                products: products
            }

            setMessages((prev) => [...prev, agentResponse])
        } catch (error) {
            console.error("Error sending message:", error)
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, something went wrong. Please try again.",
                sender: "agent",
                agentName: "System",
            }
            setMessages((prev) => [...prev, errorMsg])
        } finally {
            setIsTyping(false)
        }
    }

    const handleChatAgentChange = (newAgent: AgentType) => {
        // ChatInput allows switching agent within the chat
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

    const handleNavbarAgentChange = (agent: AgentType) => {
        // Navbar navigates to specific pages as per user request
        if (agent === "Travel") navigate("/travel-insurance")
        else if (agent === "Health") navigate("/health-insurance")
        else if (agent === "Life") navigate("/life-insurance")
        else if (agent === "Investment") navigate("/investment-insurance")
    }

    const handleNewChat = () => {
        setMessages([])
        setActiveAgent(null)
        setIsSidebarOpen(false)
    }

    return (
        <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">
            {/* Navbar with Hamburger & Logo */}
            <div className="z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-500 hover:bg-gray-100"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    {/* Branding Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/insurelogo.jpeg"
                            alt="InsureSense Logo"
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                        <div className="hidden lg:flex text-sm font-semibold tracking-tight gap-0.5">
                            <span className="text-blue-900">Insure</span>
                            <span className="text-blue-800">Sense</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navbar - Centered Dashboard Navbar (Agent Selection) */}
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <DashboardNavbar activeAgent={activeAgent} onAgentChange={handleNavbarAgentChange} />
                </div>

                {/* Desktop: Right-side Auth Buttons */}
                <div className="hidden md:flex items-center gap-3 ml-auto">
                    <Link to="/signin" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
                        Sign In
                    </Link>
                    <Link to="/signup">
                        <Button size="sm" className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
                            Sign Up
                        </Button>
                    </Link>
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
                            onAgentChange={handleChatAgentChange}
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