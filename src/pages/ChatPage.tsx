import { useState, useEffect } from "react"
import { useLocation, Link, useNavigate, useParams } from "react-router-dom"
import { ChatWindow, type Message } from "@/components/ChatWindow"
import { ChatInput, type AgentType } from "@/components/ChatInput"
import { DashboardNavbar } from "@/components/DashboardNavbar"
import { Sidebar } from "@/components/Sidebar"
import { Menu, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

// Maps an agent to its backend endpoint. `null` => generic public chat.
const AGENT_ENDPOINT: Record<AgentType, string> = {
    Life: "/api/life/chat",
    Health: "/api/health/chat",
    Travel: "/api/travel/chat",
    Investment: "/api/investment/chat",
    Crypto: "/api/crypto/chat",
}

export default function ChatPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { agentId } = useParams()
    const { user, logout } = useAuth()
    
    // Derive active agent from URL instead of local state
    const validAgents: AgentType[] = ["Life", "Health", "Travel", "Investment", "Crypto"]
    const activeAgent = agentId 
        ? validAgents.find(a => a.toLowerCase() === agentId.toLowerCase()) || null 
        : null

    const [messages, setMessages] = useState<Message[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Handle legacy navigation state by redirecting to the proper URL
    useEffect(() => {
        if (location.state?.agent) {
            const agent = location.state.agent as AgentType
            navigate(`/chat/${agent.toLowerCase()}`, { replace: true, state: {} })
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
            const endpoint = activeAgent ? AGENT_ENDPOINT[activeAgent] : "/api/chat"

            // Domain agents are protected; the generic chat endpoint is public.
            const data = await apiFetch<any>(endpoint, {
                method: "POST",
                body: { query: text },
                auth: !!activeAgent,
            })

            // Generic chat returns { response }. Domain agents return
            // { response, report, products, sources }.
            const responseText = data.response || data.text || "Sorry, I couldn't process that."

            const agentResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: "agent",
                agentName: activeAgent || "Assistant",
                products: data.products || [],
                report: data.report || undefined,
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
        if (newAgent === activeAgent) return
        
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
        navigate(`/chat/${newAgent.toLowerCase()}`)
    }

    const handleNavbarAgentChange = (agent: AgentType) => {
        handleChatAgentChange(agent)
    }

    const handleNewChat = () => {
        setMessages([])
        navigate("/chat")
        setIsSidebarOpen(false)
    }

    const firstName = user?.name?.split(" ")[0] || "there"

    return (
        <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">
            {/* Navbar with Hamburger & Logo */}
            <div className="z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="text-gray-500 hover:bg-gray-100 hidden md:flex"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="text-gray-500 hover:bg-gray-100"
                        title="Go Back"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>

                    {/* Branding Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/assets/insuresense-logo.svg"
                            alt="InsureSense Logo"
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>
                </div>

                {/* Desktop Navbar - Centered Dashboard Navbar (Agent Selection) */}
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <DashboardNavbar activeAgent={activeAgent} onAgentChange={handleNavbarAgentChange} />
                </div>

                {/* Right-side account control */}
                <div className="flex items-center gap-3 ml-auto">
                    {activeAgent && (
                        <Button 
                            onClick={() => navigate(`/${activeAgent.toLowerCase()}`)} 
                            variant="default" 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700 text-white hidden sm:flex"
                        >
                            Fill {activeAgent} Form
                        </Button>
                    )}
                    <Button onClick={logout} variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600">
                        Sign Out
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Sidebar */}
                <Sidebar
                    onNewChat={handleNewChat}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    userName={user?.name || undefined}
                />

                <main className="flex-1 flex flex-col relative bg-white transition-all duration-300">
                    {/* Main Chat Content Area */}
                    <div className="flex-1 overflow-hidden relative flex flex-col">
                        <ChatWindow
                            messages={messages}
                            isTyping={isTyping}
                            activeAgent={activeAgent}
                            greeting={`Hello, ${firstName}`}
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
