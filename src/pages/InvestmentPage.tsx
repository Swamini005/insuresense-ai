import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { TrendingUp, Rocket, Landmark, ShieldCheck, Menu, Leaf, Wallet } from "lucide-react"
import { DashboardNavbar } from "@/components/DashboardNavbar"
import { type AgentType } from "@/components/ChatInput"

// --- Options for Select Fields ---
const GOAL_OPTIONS = [
    { label: "Wealth creation", value: "wealth_creation" },
    { label: "Retirement planning", value: "retirement" },
    { label: "Child's education", value: "child_education" },
    { label: "Child's marriage", value: "child_marriage" },
    { label: "Wealth transfer / Inheritance", value: "inheritance" },
    { label: "Tax saving", value: "tax_saving" },
    { label: "Other specific goal", value: "other" },
]

const TIME_HORIZON_OPTIONS = [
    { label: "Short-term (1-3 years)", value: "short" },
    { label: "Medium-term (3-7 years)", value: "medium" },
    { label: "Long-term (7-15 years)", value: "long" },
    { label: "Very long-term (15+ years)", value: "very_long" },
]

const RISK_APPETITE_OPTIONS = [
    { label: "Conservative (Stable, lower returns)", value: "conservative" },
    { label: "Moderate (Balanced approach)", value: "moderate" },
    { label: "Aggressive (Higher risk for higher returns)", value: "aggressive" },
]

const KNOWLEDGE_OPTIONS = [
    { label: "First time exploring", value: "beginner" },
    { label: "Have some knowledge", value: "intermediate" },
    { label: "Have invested before", value: "expert" },
]

const INVESTMENT_TYPE_OPTIONS = [
    { label: "One-time lump sum amount", value: "lump_sum" },
    { label: "Regular premium (Monthly/Quarterly/Yearly)", value: "regular" },
]

export default function InvestmentPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        // Q3 & Q4: Goals
        primaryGoal: "",
        timeHorizon: "",

        // Q5: Amount
        investmentType: "",
        plannedAmount: "",
        totalTargetInvestment: "",

        // Q6 & Q7: Profile
        currentAge: "",
        dependents: "",
        annualIncome: "",
        monthlyExpenses: "",

        // Q8: Existing
        existingLifeCover: "",
        otherProducts: "",
        totalCoverAmount: "",

        // Q9-Q11: Preferences
        riskAppetite: "",
        liquidityNeeds: "",
        taxBracket: "",

        // Q12-Q13: Health & Knowledge
        healthStatus: "",
        knowledgeLevel: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Navigate to recommendations page with data
        navigate("/recommendations", {
            state: {
                formData,
                agent: "Investment"
            }
        })
    }

    const handleAgentChange = (agent: AgentType) => {
        if (agent === "Investment") return
        if (agent === "Travel") {
            navigate("/travel-insurance")
            return
        }
        if (agent === "Health") {
            navigate("/health-insurance")
            return
        }
        if (agent === "Life") {
            navigate("/life-insurance")
            return
        }
        navigate("/chat", { state: { agent } })
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Navbar */}
            <div className="z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 sticky top-0">
                {/* Header Branding & Mobile Toggle */}
                <div className="flex items-center gap-4">
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5 text-gray-500" />
                        </Button>
                    </div>

                    {/* Branding Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-110">
                            IS
                        </div>
                        <div className="hidden lg:flex text-sm font-semibold tracking-tight gap-0.5">
                            <span className="text-blue-900">Insure</span>
                            <span className="text-blue-800">Sense</span>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navbar - Centered Dashboard Navbar */}
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <DashboardNavbar activeAgent="Investment" onAgentChange={handleAgentChange} />
                </div>

                {/* Right-side Auth Buttons */}
                <div className="flex items-center gap-3 ml-auto">
                    <Link to="/signin" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                        Sign In
                    </Link>
                    <Link to="/signup">
                        <Button size="sm" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-5">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Header / Hero Section */}
            <div className="bg-gradient-to-r from-purple-700 to-violet-600 text-white pt-12 pb-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                            Grow Your Wealth Wisely.
                        </h1>
                        <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
                            Customized investment strategies aligned with your life goals and risk appetite.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-4xl mx-auto px-4 -mt-16 mb-20 relative z-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-100"
                >
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">

                        {/* Section 1: Goals & Timeline */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Rocket className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">1. Financial Vision</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Primary Financial Goal</Label>
                                    <CustomSelect
                                        options={GOAL_OPTIONS}
                                        value={formData.primaryGoal}
                                        onChange={(val) => handleChange("primaryGoal", val)}
                                        placeholder="Select Goal..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Investment Timeframe</Label>
                                    <CustomSelect
                                        options={TIME_HORIZON_OPTIONS}
                                        value={formData.timeHorizon}
                                        onChange={(val) => handleChange("timeHorizon", val)}
                                        placeholder="Select Horizon..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Investment Amount */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Wallet className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">2. Capital Allocation</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Investment Style</Label>
                                    <CustomSelect
                                        options={INVESTMENT_TYPE_OPTIONS}
                                        value={formData.investmentType}
                                        onChange={(val) => handleChange("investmentType", val)}
                                        placeholder="Select Style..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Investment Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 50,000"
                                        value={formData.plannedAmount}
                                        onChange={(e) => handleChange("plannedAmount", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2 block">Expected Total Investment over Term (Optional)</Label>
                                <Input
                                    type="number"
                                    placeholder="Total sum you plan to invest"
                                    value={formData.totalTargetInvestment}
                                    onChange={(e) => handleChange("totalTargetInvestment", e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Section 3: Profile & Financials */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Landmark className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">3. Current Snapshot</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">How old are you?</Label>
                                    <Input
                                        type="number"
                                        placeholder="Age"
                                        value={formData.currentAge}
                                        onChange={(e) => handleChange("currentAge", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Number of Dependents</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 2"
                                        value={formData.dependents}
                                        onChange={(e) => handleChange("dependents", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Approx. Annual Income (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Yearly income"
                                        value={formData.annualIncome}
                                        onChange={(e) => handleChange("annualIncome", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Monthly Expenses (₹)</Label>
                                    <Input
                                        type="number"
                                        placeholder="Monthly spend"
                                        value={formData.monthlyExpenses}
                                        onChange={(e) => handleChange("monthlyExpenses", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Existing Portfolio */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <ShieldCheck className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">4. Existing Safety Nets</h2>
                            </div>

                            <div>
                                <Label className="mb-2 block">Total Life Insurance Coverage (₹)</Label>
                                <Input
                                    type="number"
                                    placeholder="Current life cover amount"
                                    value={formData.existingLifeCover}
                                    onChange={(e) => handleChange("existingLifeCover", e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-3 block">Other existing products? (Check all that apply)</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {["Mutual Funds", "Stocks", "Fixed Deposits", "PPF", "Real Estate", "Gold"].map((prod) => (
                                        <div key={prod} className="flex items-center space-x-2 bg-slate-50 p-3 rounded-lg border border-slate-100 hover:bg-slate-100 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                id={`prod-${prod}`}
                                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                            />
                                            <label htmlFor={`prod-${prod}`} className="text-sm text-slate-700 cursor-pointer">
                                                {prod}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Risk & Preferences */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <TrendingUp className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">5. Risk & Flexibility</h2>
                            </div>

                            <div>
                                <Label className="mb-2 block">Market Risk Appetite</Label>
                                <CustomSelect
                                    options={RISK_APPETITE_OPTIONS}
                                    value={formData.riskAppetite}
                                    onChange={(val) => handleChange("riskAppetite", val)}
                                    placeholder="Choose your risk comfort..."
                                    className="w-full"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Liquidity Priority</Label>
                                    <Input
                                        placeholder="e.g. High (Need easy withdrawal)"
                                        value={formData.liquidityNeeds}
                                        onChange={(e) => handleChange("liquidityNeeds", e.target.value)}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Need access before goal date?</p>
                                </div>
                                <div>
                                    <Label className="mb-2 block">Income Tax Bracket</Label>
                                    <Input
                                        placeholder="e.g. 20% Slab"
                                        value={formData.taxBracket}
                                        onChange={(e) => handleChange("taxBracket", e.target.value)}
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">For tax-efficient recommendations.</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 6: Health & Knowledge */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Leaf className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">6. Final Checks</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Health Status (Optional)</Label>
                                    <Input
                                        placeholder="Any significant conditions..."
                                        value={formData.healthStatus}
                                        onChange={(e) => handleChange("healthStatus", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Financial Knowledge level</Label>
                                    <CustomSelect
                                        options={KNOWLEDGE_OPTIONS}
                                        value={formData.knowledgeLevel}
                                        onChange={(val) => handleChange("knowledgeLevel", val)}
                                        placeholder="Select level..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-8 flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100">
                            <Button type="button" variant="ghost" onClick={() => window.history.back()} className="rounded-full">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white min-w-[240px] rounded-full shadow-lg shadow-purple-100 border-none h-12 text-lg font-bold"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Generating Strategy..." : "Optimize My Investments"}
                            </Button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    )
}
