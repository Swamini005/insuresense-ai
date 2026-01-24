import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { ShieldCheck, MapPin, Users, HeartPulse, Menu } from "lucide-react"
import { DashboardNavbar } from "@/components/DashboardNavbar"
import { type AgentType } from "@/components/ChatInput"

// --- Options for Select Fields ---
const INTENT_OPTIONS = [
    { label: "Help with travel planning", value: "planning" },
    { label: "Checking risks for trip", value: "risks" },
    { label: "Exploring travel insurance options", value: "insurance" },
]

const TRAVELER_OPTIONS = [
    { label: "Solo", value: "solo" },
    { label: "With Family", value: "family" },
    { label: "With Friends", value: "friends" },
    { label: "Group / Organized Tour", value: "group" },
]

const PURPOSE_OPTIONS = [
    { label: "Leisure / Vacation", value: "leisure" },
    { label: "Business", value: "business" },
    { label: "Education / Study", value: "education" },
    { label: "Medical Treatment", value: "medical" },
    { label: "Visiting Family/Friends", value: "visiting" },
]

const RISK_APPETITE_OPTIONS = [
    { label: "Basic (Essential coverage only)", value: "basic" },
    { label: "Balanced (Good mix of cover & cost)", value: "balanced" },
    { label: "Comprehensive (Maximum protection)", value: "comprehensive" },
]

const BOOKING_STATUS_OPTIONS = [
    { label: "Nothing booked yet", value: "none" },
    { label: "Flights booked", value: "flights" },
    { label: "Hotels booked", value: "hotels" },
    { label: "Fully booked (Flights + Hotels)", value: "all" },
]

export default function TravelInsurancePage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        intent: "",
        origin: "",
        destination: "",
        startDate: "",
        endDate: "",
        travelers: "",
        purpose: "",
        activities: "",
        healthConditions: "",
        bookingStatus: "",
        tripCost: "",
        existingCover: false,
        riskAppetite: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        console.log("Form Submitted:", formData)
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            alert("Thanks! We've received your details. Analyzing options...")
        }, 1500)
    }

    const handleAgentChange = (agent: AgentType) => {
        if (agent === "Travel") return
        if (agent === "Health") {
            navigate("/health-insurance")
            return
        }
        if (agent === "Life") {
            navigate("/life-insurance")
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

                {/* Desktop Navbar - Centered Dashboard Navbar */}
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <DashboardNavbar activeAgent="Travel" onAgentChange={handleAgentChange} />
                </div>

                {/* Right-side Auth Buttons */}
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

            {/* Header / Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white pt-12 pb-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                            Travel Smart. Travel Safe.
                        </h1>
                        <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
                            Tell us a bit about your trip, and we'll find the perfect protection plan for you.
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
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">

                        {/* Section 1: Intent & Basic Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <ShieldCheck className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Your Goal</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">What brings you here today?</Label>
                                    <CustomSelect
                                        options={INTENT_OPTIONS}
                                        value={formData.intent}
                                        onChange={(val) => handleChange("intent", val)}
                                        placeholder="Select your goal..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Level of protection desired</Label>
                                    <CustomSelect
                                        options={RISK_APPETITE_OPTIONS}
                                        value={formData.riskAppetite}
                                        onChange={(val) => handleChange("riskAppetite", val)}
                                        placeholder="Choose risk coverage..."
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Trip Details */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <MapPin className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Trip Details</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Traveling From</Label>
                                    <Input
                                        placeholder="e.g. Mumbai, India"
                                        value={formData.origin}
                                        onChange={(e) => handleChange("origin", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Destination</Label>
                                    <Input
                                        placeholder="e.g. Paris, France"
                                        value={formData.destination}
                                        onChange={(e) => handleChange("destination", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Start Date</Label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => handleChange("startDate", e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">End Date (Approx)</Label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => handleChange("endDate", e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Who & Why */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <Users className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Who & Why</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Who is traveling?</Label>
                                    <CustomSelect
                                        options={TRAVELER_OPTIONS}
                                        value={formData.travelers}
                                        onChange={(val) => handleChange("travelers", val)}
                                        placeholder="Select travelers..."
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Main Purpose</Label>
                                    <CustomSelect
                                        options={PURPOSE_OPTIONS}
                                        value={formData.purpose}
                                        onChange={(val) => handleChange("purpose", val)}
                                        placeholder="Select purpose..."
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2 block">Planned Activities (Optional)</Label>
                                <Input
                                    placeholder="e.g. Skiing, Scuba diving, Sightseeing..."
                                    value={formData.activities}
                                    onChange={(e) => handleChange("activities", e.target.value)}
                                />
                                <p className="text-xs text-slate-500 mt-1">List any adventure sports or special activities.</p>
                            </div>
                        </div>

                        {/* Section 4: Health & Financials */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
                                <HeartPulse className="text-purple-600 h-5 w-5" />
                                <h2 className="text-xl font-semibold text-slate-800">Health & Budget</h2>
                            </div>

                            <div>
                                <Label className="mb-2 block">Pre-existing Conditions</Label>
                                <Input
                                    placeholder="Describe any medical conditions we should know about (optional)"
                                    value={formData.healthConditions}
                                    onChange={(e) => handleChange("healthConditions", e.target.value)}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <Label className="mb-2 block">Booking Status</Label>
                                    <CustomSelect
                                        options={BOOKING_STATUS_OPTIONS}
                                        value={formData.bookingStatus}
                                        onChange={(val) => handleChange("bookingStatus", val)}
                                        placeholder="What's booked so far?"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Label className="mb-2 block">Estimated Trip Cost</Label>
                                    <Input
                                        type="number"
                                        placeholder="Total cost estimate"
                                        value={formData.tripCost}
                                        onChange={(e) => handleChange("tripCost", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 bg-purple-50 p-4 rounded-lg border border-purple-100">
                                <input
                                    type="checkbox"
                                    id="existingCover"
                                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    checked={formData.existingCover}
                                    onChange={(e) => handleChange("existingCover", e.target.checked)}
                                />
                                <label htmlFor="existingCover" className="text-sm font-medium text-slate-700 cursor-pointer">
                                    I already have some travel coverage (e.g. from credit card or employer)
                                </label>
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
                                {isSubmitting ? "Processing..." : "Analyze Risks & Get Quote"}
                            </Button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </div>
    )
}
