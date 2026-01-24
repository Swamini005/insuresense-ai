import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type AgentType } from "@/components/ChatInput"

interface DashboardNavbarProps {
    activeAgent: AgentType
    onAgentChange: (agent: AgentType) => void
}

const agents: AgentType[] = ["Life", "Health", "Travel", "Investment"]

export function DashboardNavbar({ activeAgent: _activeAgent, onAgentChange }: DashboardNavbarProps) {
    return (
        <div className="flex items-center justify-center p-2 rounded-full bg-white/20 backdrop-blur-md border border-purple-300/60 shadow-sm mx-auto max-w-fit transition-all duration-300 hover:shadow-purple-200/20">
            <div className="flex items-center gap-1 sm:gap-2">
                {agents.map((agent) => (
                    <Button
                        key={agent}
                        variant="ghost"
                        onClick={() => onAgentChange(agent)}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                        )}
                    >
                        {agent}
                    </Button>
                ))}
            </div>
        </div>
    )
}
