import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Heart, ShieldCheck, Banknote, Umbrella, Menu } from "lucide-react"
import { DashboardNavbar } from "@/components/DashboardNavbar"
import { type AgentType } from "@/components/ChatInput"

// --- Options ---
const GOAL_OPTIONS = [
    { label: "Family Protection (Term Life)", value: "family_protection" },
    { label: "Wealth Creation (ULIP/Endowment)", value: "wealth_creation" },
    { label: "Saving for Milestone (Child/Retirement)", value: "milestone_saving" },
]

const RISK_PREF_OPTIONS = [
    { label: "Guaranteed Returns (Low Risk)", value: "guaranteed" },
    { label: "Balanced (Moderate Risk)", value: "balanced" },
    { label: "Market Linked (High Growth Potential)", value: "market_linked" },
]

const PAYOUT_OPTIONS = [
    { label: "Lump Sum Amount", value: "lump_sum" },
    { label: "Monthly Income Stream", value: "monthly_income" },
    { label: "Hybrid (Part Lump Sum + Part Income)", value: "hybrid" },
]

const OCCUPATION_RISK_OPTIONS = [
    { label: "Low Risk (Desk job, etc.)", value: "low" },
    { label: "Medium Risk (Field work, etc.)", value: "medium" },
    { label: "High Risk (Mining, Pilot, etc.)", value: "high" },
]

export default function LifeInsurancePage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        // Identity
        currentAge: "",
        retirementAge: "60",
        dependents: { spouse: false, children: "0", parents: "0" },

        // Goal
        primaryGoal: "",
        minMonthlyExpense: "",

        // Financials
        annualIncome: "",
        liabilities: { homeLoan: "", carLoan: "", other: "" },
        liquidAssets: "",

        // Safety Nets
        existingCover: "", // neutral (yes/no)
        employerCover: "", // neutral (yes/no)

        // Risk & Features
        marketRisk: "",
        coverageType: "", // was till_retirement
        premiumTerm: "", // was regular

        // Health/Lifestyle
        tobacco: "", // was no
        alcohol: "", // was none
        medicalHistory: "", // was none
        occupationRisk: "", // was low

        // Payout
        payoutPref: "" // was lump_sum
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Helper for updating flat fields
    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Helper for updating nested fields (like dependents, liabilities)
    const handleNestedChange = (section: string, field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        console.log("Life Form Submitted:", formData)
        setTimeout(() => {
            setIsSubmitting(false)
            alert("Life Insurance Profile Created. Calculating Human Life Value...")
        }, 1500)
    }

    const handleAgentChange = (agent: AgentType) => {
        if (agent === "Life") return
        if (agent === "Travel") {
            navigate("/travel-insurance")
            return
        }
        if (agent === "Health") {
            navigate("/health-insurance")
            return
        }
        if (agent === "Investment") {
            navigate("/investment-insurance")
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
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform group-hover:scale-110">
                            IS
                        </div>
                        <div className="hidden lg:flex text-sm font-semibold tracking-tight gap-0.5">
                            <span className="text-blue-900">Insure</span>
                            <span className="text-blue-800">Sense</span>
                        </div>
                    </Link>
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <DashboardNavbar activeAgent="Life" onAgentChange={handleAgentChange} />
                </div>
                <div className="flex items-center gap-3 ml-auto">
                    <Link to="/signin" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
                        Sign In
                    </Link>
                    <Link to="/signup">
                        <Button size="sm" className="rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm px-5">
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Hero */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white pt-12 pb-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                            Secure Their Future
                        </h1>
                        <p className="text-lg md:text-xl text-rose-100 max-w-2xl mx-auto">
                            Life insurance that adapts to your financial goals and family needs.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-4xl mx-auto px-4 -mt-16 mb-20 relative z-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl border border-slate-100"
                >
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">

                        {/* 1. Identity & Goals */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Heart className="text-rose-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">You & Your Goals</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Current Age</Label>
                                    <Input
                                        type="number"
                                        value={formData.currentAge}
                                        onChange={(e) => handleChange("currentAge", e.target.value)}
                                        placeholder="Age"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Primary Goal</Label>
                                    <CustomSelect
                                        options={GOAL_OPTIONS}
                                        value={formData.primaryGoal}
                                        onChange={(val) => handleChange("primaryGoal", val)}
                                        placeholder="Select Goal..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Financials */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Banknote className="text-rose-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Financial Snapshot</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Annual Take-home Income</Label>
                                    <Input
                                        type="number"
                                        value={formData.annualIncome}
                                        onChange={(e) => handleChange("annualIncome", e.target.value)}
                                        placeholder="₹ / year"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Monthly Family Expense</Label>
                                    <Input
                                        type="number"
                                        value={formData.minMonthlyExpense}
                                        onChange={(e) => handleChange("minMonthlyExpense", e.target.value)}
                                        placeholder="₹ / month"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="mb-2 block">Outstanding Loans (Total)</Label>
                                <Input
                                    type="number"
                                    value={formData.liabilities.homeLoan} // Using homeLoan slot for total for simplicity in this view
                                    onChange={(e) => handleNestedChange("liabilities", "homeLoan", e.target.value)}
                                    placeholder="Total debt (Home, Car, etc.)"
                                />
                            </div>
                        </div>

                        {/* 3. Risk & Health */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <ShieldCheck className="text-rose-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Risk Profile</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Investment Preference</Label>
                                    <CustomSelect
                                        options={RISK_PREF_OPTIONS}
                                        value={formData.marketRisk}
                                        onChange={(val) => handleChange("marketRisk", val)}
                                        placeholder="Risk Appetite..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Occupation Type</Label>
                                    <CustomSelect
                                        options={OCCUPATION_RISK_OPTIONS}
                                        value={formData.occupationRisk}
                                        onChange={(val) => handleChange("occupationRisk", val)}
                                        placeholder="Select Occupation..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="mb-2 block">Tobacco / Nicotine Use</Label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2"><input type="radio" checked={formData.tobacco === "yes"} onChange={() => handleChange("tobacco", "yes")} className="text-rose-600" /> Yes</label>
                                    <label className="flex items-center gap-2"><input type="radio" checked={formData.tobacco === "no"} onChange={() => handleChange("tobacco", "no")} className="text-rose-600" /> No</label>
                                </div>
                            </div>
                        </div>

                        {/* 4. Payout Preference */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Umbrella className="text-rose-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Claim Payout</h2>
                            </div>
                            <div>
                                <Label className="mb-2 block">How should your family receive the money?</Label>
                                <CustomSelect
                                    options={PAYOUT_OPTIONS}
                                    value={formData.payoutPref}
                                    onChange={(val) => handleChange("payoutPref", val)}
                                    placeholder="Select Preference..."
                                    className="w-full"
                                />
                            </div>
                        </div>


                        {/* Action Buttons */}
                        <div className="pt-6 flex justify-end gap-4">
                            <Button type="button" variant="ghost" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-rose-600 hover:bg-rose-700 text-white min-w-[200px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Calculating..." : "Analyze Needs"}
                            </Button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    )
}
