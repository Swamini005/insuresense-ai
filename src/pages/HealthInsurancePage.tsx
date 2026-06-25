import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Shield, Users, Activity, Menu } from "lucide-react"
import { DashboardNavbar } from "@/components/DashboardNavbar"
import { type AgentType } from "@/components/ChatInput"

// --- Options for Select Fields ---
const HEALTH_INTENT_OPTIONS = [
    { label: "Buy a new policy", value: "new_policy" },
    { label: "Upgrade existing policy", value: "upgrade_policy" },
    { label: "Check my coverage gaps", value: "coverage_check" },
]

const COVERAGE_TYPE_OPTIONS = [
    { label: "Individual (Self only)", value: "self" },
    { label: "Family Floater (Self + Family)", value: "self_plus_family" },
]

const SUM_INSURED_OPTIONS = [
    { label: "₹5 Lakhs", value: "5L" },
    { label: "₹10 Lakhs", value: "10L" },
    { label: "₹20 Lakhs", value: "20L" },
    { label: "₹50 Lakhs+", value: "50L" },
    { label: "Not sure, recommend me", value: "not_sure" },
]

const HOSPITAL_PREF_OPTIONS = [
    { label: "Top-tier Private Hospitals", value: "top_private" },
    { label: "Mix of Private & Budget", value: "mixed" },
    { label: "Budget Friendly", value: "budget" },
]

const TIMELINE_OPTIONS = [
    { label: "Immediately", value: "immediate" },
    { label: "Within 1 month", value: "1_month" },
    { label: "Within 3 months", value: "3_months" },
    { label: "Just exploring", value: "just_exploring" },
]

// Assuming simplified multiselect for now or just text inputs for complex arrays in this iteration to match UI components available
// const PRIORITY_OPTIONS = [
//     { label: "Low Premium", value: "low_premium" },
//     { label: "Maximum Coverage", value: "high_coverage" },
//     { label: "Low Out-of-Pocket", value: "low_out_of_pocket" },
//     { label: "Extra Benefits (Maternity, OPD)", value: "extra_benefits" },
// ]

export default function HealthInsurancePage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        healthIntent: "",
        coverageType: "",
        familyMembers: [] as string[], // Store as array
        city: "",
        state: "",
        hasPreExisting: "", // yes/no
        conditions: [] as string[],
        existingPolicy: "", // yes/no/unsure
        sumInsured: "",
        hospitalPref: "",
        budgetRange: "", // simplified
        lifestyle: { smoking: "no", alcohol: "no", activity: "moderate" },
        priorities: [] as string[],
        timeline: ""
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    // Helper for simple field updates
    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    // Helper for nested lifestyle updates
    // const handleLifestyleChange = (key: string, value: string) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         lifestyle: { ...prev.lifestyle, [key]: value }
    //     }))
    // }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Navigate to recommendations page with data
        navigate("/recommendations", {
            state: {
                formData,
                agent: "Health"
            }
        })
    }

    const handleAgentChange = (agent: AgentType) => {
        if (agent === "Health") return
        if (agent === "Travel") {
            navigate("/travel")
            return
        }
        if (agent === "Life") {
            navigate("/life")
            return
        }
        if (agent === "Investment") {
            navigate("/investment")
            return
        }
        if (agent === "Crypto") {
            navigate("/crypto")
            return
        }
        navigate(`/chat/${agent.toLowerCase()}`)
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
                        <img
                            src="/assets/insuresense-logo.svg"
                            alt="InsureSense Logo"
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>
                </div>
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <DashboardNavbar activeAgent="Health" onAgentChange={handleAgentChange} />
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
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white pt-12 pb-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                            Complete Health Protection
                        </h1>
                        <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
                            Comprehensive coverage for you and your family.
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

                        {/* 1. Intent & Scope */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Shield className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Coverage Needs</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">I want to...</Label>
                                    <CustomSelect
                                        options={HEALTH_INTENT_OPTIONS}
                                        value={formData.healthIntent}
                                        onChange={(val) => handleChange("healthIntent", val)}
                                        placeholder="Select intent..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Who needs coverage?</Label>
                                    <CustomSelect
                                        options={COVERAGE_TYPE_OPTIONS}
                                        value={formData.coverageType}
                                        onChange={(val) => handleChange("coverageType", val)}
                                        placeholder="Select members..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            {/* Conditional Family Members could go here */}
                        </div>

                        {/* 2. Location & Background */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Users className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Personal Details</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">City</Label>
                                    <Input
                                        placeholder="e.g. Bangalore"
                                        value={formData.city}
                                        onChange={(e) => handleChange("city", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">State</Label>
                                    <Input
                                        placeholder="e.g. Karnataka"
                                        value={formData.state}
                                        onChange={(e) => handleChange("state", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Simple Yes/No for Pre-existing */}
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <Label className="mb-3 block font-semibold">Do you have any pre-existing medical conditions?</Label>
                                <div className="flex gap-4">
                                    {["Yes", "No", "Prefer not to say"].map((opt) => (
                                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="preExisting"
                                                value={opt}
                                                checked={formData.hasPreExisting === opt}
                                                onChange={(e) => handleChange("hasPreExisting", e.target.value)}
                                                className="text-purple-600 focus:ring-purple-500"
                                            />
                                            <span className="text-sm text-slate-700">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Preferences */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Activity className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Plan Preferences</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Desired Sum Insured</Label>
                                    <CustomSelect
                                        options={SUM_INSURED_OPTIONS}
                                        value={formData.sumInsured}
                                        onChange={(val) => handleChange("sumInsured", val)}
                                        placeholder="Choose amount..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Hospital Tier Preference</Label>
                                    <CustomSelect
                                        options={HOSPITAL_PREF_OPTIONS}
                                        value={formData.hospitalPref}
                                        onChange={(val) => handleChange("hospitalPref", val)}
                                        placeholder="Hospital type..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="mb-2 block">When do you plan to purchase?</Label>
                                <CustomSelect
                                    options={TIMELINE_OPTIONS}
                                    value={formData.timeline}
                                    onChange={(val) => handleChange("timeline", val)}
                                    placeholder="Select timeline..."
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
                                className="bg-purple-600 hover:bg-purple-700 text-white min-w-[200px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Analyzing..." : "Find Health Plans"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}
