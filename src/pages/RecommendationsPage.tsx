import { useEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowRight, Newspaper, ShoppingBag, ArrowLeft, FileText } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import ReactMarkdown from "react-markdown"
import { apiFetch } from "@/lib/api"

// Type definitions
interface Product {
    id: string
    name: string
    description: string
    price: string
}

interface RecommendationResponse {
    text: string
    report?: string
    products: Product[]
    sources?: { title: string; url: string }[]
}

interface AgentConfig {
    saveUrl: string
    agentUrl: string
    newsUrl: string
    prompt: string
    title: string
}

// Endpoint configuration
const AGENT_CONFIG: Record<string, AgentConfig> = {
    Health: {
        saveUrl: "/api/health/healthdetails",
        agentUrl: "/api/health/recommendations",
        newsUrl: "/api/health/healthinsurancenews",
        prompt: "Based on my health profile, suggest the best health insurance plans for me. Search for real plans.",
        title: "Your Health Plan",
    },
    Life: {
        saveUrl: "/api/life/lifedetails",
        agentUrl: "/api/life/recommendations",
        newsUrl: "/api/life/lifeinsurencenews",
        prompt: "Based on my life profile, suggest the best life insurance/term plans for me. Search for real policies.",
        title: "Your Life Cover",
    },
    Travel: {
        saveUrl: "/api/travel/traveldetails",
        agentUrl: "/api/travel/recommendations",
        newsUrl: "/api/travel/travelinsurancenewsinsights",
        prompt: "Based on my travel plans, suggest the best travel insurance. Search for real quotes.",
        title: "Your Trip Shield",
    },
    Investment: {
        saveUrl: "/api/investment/investmentdetails",
        agentUrl: "/api/investment/recommendations",
        newsUrl: "/api/investment/investmentnewsinsights",
        prompt: "Based on my investment profile, suggest the best mutual funds or investment options. Search for real live products.",
        title: "Your Wealth Strategy",
    },
    Crypto: {
        saveUrl: "/api/crypto/cryptodetails",
        agentUrl: "/api/crypto/recommendations",
        newsUrl: "/api/crypto/cryptonewsinsights",
        prompt: "Based on my crypto profile, suggest suitable crypto assets/products. Use live web search for real current data.",
        title: "Your Crypto Playbook",
    },
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
                // 1. Save the user's profile (protected)
                await apiFetch(config.saveUrl, { method: "POST", body: formData, auth: true })

                // 2 & 3. Ask the agent AND fetch market news concurrently
                const [agentData, newsData] = await Promise.all([
                    apiFetch<any>(config.agentUrl, {
                        method: "POST",
                        body: { query: config.prompt },
                        auth: true,
                    }),
                    apiFetch<any>(config.newsUrl)
                ])

                setRecommendation({
                    text: agentData.response || agentData.text || "",
                    report: agentData.report,
                    products: agentData.products || [],
                    sources: agentData.sources || [],
                })

                setNews(newsData.insights || newsData)
            } catch (err: any) {
                console.error("Error fetching recommendations:", err)
                setError(err.message || "Failed to generate recommendations. Please try again.")
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
                <Link to="/chat">
                    <Button>Back to Dashboard</Button>
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
                            src="/assets/insuresense-logo.svg"
                            alt="InsureSense Logo"
                            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                    <Link to={`/${agent?.toLowerCase()}`}>
                        <Button variant="ghost" size="sm" className="text-slate-600">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Edit Details
                        </Button>
                    </Link>
                    <Link to="/chat">
                        <Button variant="outline" size="sm" className="text-slate-600">
                            Back to Dashboard
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

                    {/* Breakthrough Report (Summarizer) */}
                    {recommendation?.report && (
                        <div className="space-y-8 relative">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                    <h2 className="text-2xl font-bold text-slate-900">Your Breakthrough Report</h2>
                                </div>
                                <Button 
                                    variant="outline" 
                                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hidden sm:flex"
                                    onClick={() => {
                                        const blob = new Blob([recommendation.report!], { type: 'text/markdown' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${agent}-Breakthrough-Report.md`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }}
                                >
                                    Download Report
                                </Button>
                            </div>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 markdown-content">
                                <ReactMarkdown
                                    components={{
                                        p: ({node, ...props}) => <p className="mb-4 text-slate-700 leading-relaxed" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 text-slate-700" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 text-slate-700" {...props} />,
                                        li: ({node, ...props}) => <li className="mb-2" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                                        h1: ({node, ...props}) => <h1 className="text-2xl font-black mb-4 mt-6 text-slate-900" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 mt-6 text-slate-900" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-3 mt-5 text-slate-900" {...props} />
                                    }}
                                >
                                    {recommendation.report}
                                </ReactMarkdown>
                            </div>
                            <div className="sm:hidden flex justify-center mt-4">
                                <Button 
                                    variant="outline" 
                                    className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                                    onClick={() => {
                                        const blob = new Blob([recommendation.report!], { type: 'text/markdown' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `${agent}-Breakthrough-Report.md`;
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                        URL.revokeObjectURL(url);
                                    }}
                                >
                                    Download Report
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* News / Sources */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                            <Newspaper className="h-6 w-6 text-purple-600" />
                            <h2 className="text-2xl font-bold text-slate-900">Market Insights</h2>
                        </div>

                        {(() => {
                            if (!news) {
                                return (
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                        <p className="text-slate-600">No specific news insights available at the moment.</p>
                                    </div>
                                );
                            }

                            // Try to parse stringified JSON if it's a string
                            let parsedNews = news;
                            if (typeof news === 'string') {
                                try {
                                    const parsed = JSON.parse(news);
                                    if (Array.isArray(parsed) || typeof parsed === 'object') {
                                        parsedNews = parsed;
                                    }
                                } catch (e) {
                                    // It's just a normal markdown string
                                }
                            }

                            // Render Array of news items
                            if (Array.isArray(parsedNews)) {
                                return (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {parsedNews.map((item: any, i: number) => (
                                            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                                <h3 className="font-bold text-slate-900 mb-2">{item.title || "Market Update"}</h3>
                                                <p className="text-sm text-slate-600 mb-4">{item.summary || item.description || ""}</p>
                                                {item.source && (
                                                    <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
                                                        Source: {item.source}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                );
                            }

                            // Render Markdown String
                            if (typeof parsedNews === 'string') {
                                return (
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 markdown-content">
                                        <ReactMarkdown
                                            components={{
                                                p: ({node, ...props}) => <p className="mb-4 text-slate-700 leading-relaxed" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 text-slate-700" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 text-slate-700" {...props} />,
                                                li: ({node, ...props}) => <li className="mb-2" {...props} />,
                                                strong: ({node, ...props}) => <strong className="font-bold text-slate-900" {...props} />,
                                                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3 mt-5 text-slate-900" {...props} />,
                                                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-4 text-slate-900" {...props} />
                                            }}
                                        >
                                            {parsedNews}
                                        </ReactMarkdown>
                                    </div>
                                );
                            }

                            // Fallback for unexpected objects
                            return (
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                    <pre className="whitespace-pre-wrap text-sm text-slate-600">{JSON.stringify(parsedNews, null, 2)}</pre>
                                </div>
                            );
                        })()}
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
