import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Target, Wallet, Gauge, Menu } from "lucide-react"
import { DashboardNavbar } from "@/components/DashboardNavbar"
import { type AgentType } from "@/components/ChatInput"

const GOAL_OPTIONS = [
    { label: "Long-term wealth growth", value: "growth" },
    { label: "Short-term trading gains", value: "trading" },
    { label: "Passive income (staking/yield)", value: "income" },
    { label: "Portfolio diversification", value: "diversification" },
    { label: "Just learning / exploring", value: "learning" },
]

const TIME_HORIZON_OPTIONS = [
    { label: "Short-term (< 1 year)", value: "short" },
    { label: "Medium-term (1-3 years)", value: "medium" },
    { label: "Long-term (3+ years)", value: "long" },
]

const RISK_APPETITE_OPTIONS = [
    { label: "Conservative (stablecoins, blue-chips)", value: "conservative" },
    { label: "Moderate (balanced large/mid-cap)", value: "moderate" },
    { label: "Aggressive (high-risk, high-reward)", value: "aggressive" },
]

const EXPERIENCE_OPTIONS = [
    { label: "Beginner (new to crypto)", value: "beginner" },
    { label: "Intermediate (have traded before)", value: "intermediate" },
    { label: "Advanced (active investor)", value: "advanced" },
]

export default function CryptoPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        primaryGoal: "",
        timeHorizon: "",
        investmentAmount: "",
        monthlyContribution: "",
        riskAppetite: "",
        experienceLevel: "",
        preferredAssets: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        navigate("/recommendations", {
            state: { formData, agent: "Crypto" },
        })
    }

    const handleAgentChange = (agent: AgentType) => {
        if (agent === "Crypto") return
        if (agent === "Travel") { navigate("/travel"); return }
        if (agent === "Health") { navigate("/health"); return }
        if (agent === "Life") { navigate("/life"); return }
        if (agent === "Investment") { navigate("/investment"); return }
        navigate(`/chat/${agent.toLowerCase()}`)
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Navbar */}
            <div className="z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5 text-gray-500" />
                        </Button>
                    </div>
                    <Link to="/" className="flex items-center gap-2 group">
                        <img
                            src="/assets/insuresense-logo.svg"
                            alt="InsureSense Logo"
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 items-center justify-center">
                    <DashboardNavbar activeAgent="Crypto" onAgentChange={handleAgentChange} />
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <Link to="/chat" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors">
                        Dashboard
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white pt-12 pb-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                            Navigate Crypto with Confidence.
                        </h1>
                        <p className="text-lg md:text-xl text-amber-50 max-w-2xl mx-auto">
                            Personalized, risk-aware crypto guidance backed by live market data.
                            <span className="block text-sm text-amber-100/90 mt-2">Informational only — not financial advice.</span>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 -mt-16 mb-20 relative z-0 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-100"
                >
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">

                        {/* Section 1: Goals */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Target className="text-amber-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">1. Your Goal</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Primary Goal</Label>
                                    <CustomSelect
                                        options={GOAL_OPTIONS}
                                        value={formData.primaryGoal}
                                        onChange={(val) => handleChange("primaryGoal", val)}
                                        placeholder="Select goal..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Time Horizon</Label>
                                    <CustomSelect
                                        options={TIME_HORIZON_OPTIONS}
                                        value={formData.timeHorizon}
                                        onChange={(val) => handleChange("timeHorizon", val)}
                                        placeholder="Select horizon..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Capital */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Wallet className="text-amber-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">2. Capital</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Amount to Invest (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 100000"
                                        value={formData.investmentAmount}
                                        onChange={(e) => handleChange("investmentAmount", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Monthly Contribution (₹, optional)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 10000"
                                        value={formData.monthlyContribution}
                                        onChange={(e) => handleChange("monthlyContribution", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Risk & Experience */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Gauge className="text-amber-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">3. Risk & Experience</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Risk Appetite</Label>
                                    <CustomSelect
                                        options={RISK_APPETITE_OPTIONS}
                                        value={formData.riskAppetite}
                                        onChange={(val) => handleChange("riskAppetite", val)}
                                        placeholder="Choose your risk comfort..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Experience Level</Label>
                                    <CustomSelect
                                        options={EXPERIENCE_OPTIONS}
                                        value={formData.experienceLevel}
                                        onChange={(val) => handleChange("experienceLevel", val)}
                                        placeholder="Select level..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="mb-2 block">Preferred Assets (optional)</Label>
                                <Input
                                    placeholder="e.g. Bitcoin, Ethereum, stablecoins..."
                                    value={formData.preferredAssets}
                                    onChange={(e) => handleChange("preferredAssets", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-8 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100">
                            <Button type="button" variant="ghost" onClick={() => window.history.back()} className="rounded-full">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white min-w-[240px] rounded-full shadow-lg shadow-amber-100 border-none h-12 text-lg font-bold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Building Playbook..." : "Get Crypto Guidance"}
                            </Button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    )
}
