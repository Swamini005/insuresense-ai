import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, Newspaper, ShoppingBag, ArrowLeft } from "lucide-react"
import { ProductCard } from "@/components/ProductCard" // Assuming this exists or I will create it/use it
import { DashboardNavbar } from "@/components/DashboardNavbar"

// Type definitions
interface Product {
    id: string
    name: string
    description: string
    price: string
}

interface NewsItem {
    title: string
    url: string
    summary?: string
}

interface RecommendationResponse {
    text: string
    products: Product[]
    sources?: NewsItem[]
}

// Endpoint configuration
const AGENT_CONFIG: any = {
    Health: {
        saveUrl: "/api/health/healthdetails",
        agentUrl: "/api/health/healthagent",
        newsUrl: "/api/health/healthinsurancenews",
        prompt: "Based on my health profile, suggest the best health insurance plans for me. Search for real plans.",
        title: "Your Health Plan",
        gradient: "from-purple-600 to-violet-600"
    },
    Life: {
        saveUrl: "/api/life/lifedetails",
        agentUrl: "/api/life/lifeagent",
        newsUrl: "/api/life/lifeinsurencenews",
        prompt: "Based on my life profile, suggest the best life insurance/term plans for me. Search for real policies.",
        title: "Your Life Cover",
        gradient: "from-purple-600 to-violet-600"
    },
    Travel: {
        saveUrl: "/api/travel/traveldetails",
        agentUrl: "/api/travel/travelagent",
        newsUrl: "/api/travel/travelinsurancenewsinsights",
        prompt: "Based on my travel plans, suggest the best travel insurance. Search for real quotes.",
        title: "Your Trip Shield",
        gradient: "from-purple-600 to-violet-600"
    },
    Investment: {
        saveUrl: "/api/investment/investmentdetails",
        agentUrl: "/api/investment/investmentagent",
        newsUrl: "/api/investment/investmentnewsinsights",
        prompt: "Based on my investment profile, suggest the best mutual funds or investment options. Search for real live products.",
        title: "Your Wealth Strategy",
        gradient: "from-purple-600 to-violet-600"
    }
}

export default function RecommendationsPage() {
    const location = useLocation()
    const { formData, agent } = location.state || {}

    const [loading, setLoading] = useState(true)
    const [recommendation, setRecommendation] = useState<RecommendationResponse | null>(null)
    const [news, setNews] = useState<any>(null)
    const [error, setError] = useState("")

    const config = AGENT_CONFIG[agent] || AGENT_CONFIG["Health"] // Fallback

    useEffect(() => {
        if (!formData || !agent) {
            setError("No data provided. Please fill out the form first.")
            setLoading(false)
            return
        }

        const fetchData = async () => {
            try {
                // 1. Save Data
                console.log("Saving data to", config.saveUrl)
                await fetch(`http://localhost:3000${config.saveUrl}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData)
                })

                // 2. Get Recommendations (Agent)
                console.log("Querying agent at", config.agentUrl)
                const agentRes = await fetch(`http://localhost:3000${config.agentUrl}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: config.prompt })
                })
                const agentData = await agentRes.json()
                setRecommendation(agentData)

                // 3. Get News
                console.log("Fetching news from", config.newsUrl)
                const newsRes = await fetch(`http://localhost:3000${config.newsUrl}`)
                const newsData = await newsRes.json()

                // Handle different news response structures if needed, usually it returns { insights: "..." } or similar
                // If it returns a string, we might need to parse it or display it as text. 
                // Checks backend controller: it returns { insights: text } usually.
                setNews(newsData.insights || newsData)

            } catch (err: any) {
                console.error("Error fetching recommendations:", err)
                setError("Failed to generate recommendations. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [formData, agent])

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-slate-50">
                <p className="text-red-600 font-medium">{error}</p>
                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navbar */}
            <div className="z-10 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3 sticky top-0">
                <div className="flex items-center gap-4">
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
                <div className="flex items-center gap-3 ml-auto">
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="text-slate-600">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
                    <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-6" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing your profile...</h2>
                    <p className="text-slate-500 max-w-md">
                        Our AI is scanning live market data to find the best {agent} products for you. This may take a moment.
                    </p>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-4">
                            <ShoppingBag className="h-3 w-3" /> Personalized Recommendations
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                            {config.title}
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {recommendation?.text}
                        </p>
                    </motion.div>

                    {/* Products Grid */}
                    {recommendation?.products && recommendation.products.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                <ShoppingBag className="h-6 w-6 text-purple-600" />
                                <h2 className="text-2xl font-bold text-slate-900">Recommended Products</h2>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {recommendation.products.map((prod, idx) => (
                                    <motion.div
                                        key={prod.id || idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <ProductCard product={prod} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* News / Sources */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                            <Newspaper className="h-6 w-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-slate-900">Market Insights</h2>
                        </div>

                        {/* If news is a string (markdown), render it simply, or if list of sources */}
                        {typeof news === 'string' ? (
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 prose prose-purple max-w-none">
                                <pre className="whitespace-pre-wrap font-sans text-slate-600">{news}</pre>
                            </div>
                        ) : (
                            // Fallback or specific structure handling
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <p className="text-slate-600">No specific news insights available at the moment.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center pt-12">
                        <Link to="/chat">
                            <Button size="lg" className="rounded-full bg-purple-600 hover:bg-purple-700 h-14 px-8 text-lg shadow-xl shadow-purple-200">
                                Chat with AI Agent <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>

                </div>
            )}
        </div>
    )
}
