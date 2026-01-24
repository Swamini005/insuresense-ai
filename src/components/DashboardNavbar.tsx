import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type AgentType } from "@/components/ChatInput"

interface DashboardNavbarProps {
    activeAgent: AgentType | null
    onAgentChange: (agent: AgentType) => void
}

const agents: AgentType[] = ["Life", "Health", "Travel", "Investment"]

export function DashboardNavbar({ activeAgent, onAgentChange }: DashboardNavbarProps) {
    return (
        <div className="flex items-center justify-center p-1.5 rounded-full bg-slate-100/50 backdrop-blur-md border border-slate-200 shadow-sm mx-auto max-w-fit transition-all duration-300 hover:shadow-slate-200/20">
            <div className="flex items-center gap-1 sm:gap-2">
                {agents.map((agent) => (
                    <Button
                        key={agent}
                        variant="ghost"
                        onClick={() => onAgentChange(agent)}
                        className={cn(
                            "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                            activeAgent === agent
                                ? "bg-purple-600 text-white hover:bg-purple-700 hover:text-white shadow-md"
                                : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                        )}
                    >
                        {agent}
                    </Button>
                ))}
            </div>
        </div>
    )
}
