import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const slides = [
  { 
    id: "s1", 
    title: "Let's Invest",
    subtitle: "Smart Investment Decisions",
    description: "AI-powered portfolio recommendations based on your risk profile and market conditions.",
    cta: "Start Investing", 
    img: "/carousel/lets-invest.svg",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-gradient-to-br from-emerald-50 to-teal-50"
  },
  { 
    id: "s2", 
    title: "Let's Go",
    subtitle: "Travel with Confidence",
    description: "Real-time travel risk analysis with instant coverage recommendations for your journey.",
    cta: "Plan Your Trip", 
    img: "/carousel/lets-go.svg",
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50"
  },
  { 
    id: "s3", 
    title: "Let's Live",
    subtitle: "Health First, Always",
    description: "Comprehensive health monitoring with personalized insurance timing based on wellness data.",
    cta: "Get Protected", 
    img: "/carousel/lets-live.svg",
    gradient: "from-rose-500 to-pink-600",
    bg: "bg-gradient-to-br from-rose-50 to-pink-50"
  },
  { 
    id: "s4", 
    title: "Let's Care",
    subtitle: "Family Protection Made Easy",
    description: "Unified family coverage with AI that adapts to your family's changing needs.",
    cta: "Protect Family", 
    img: "/carousel/lets-care.svg",
    gradient: "from-purple-500 to-violet-600",
    bg: "bg-gradient-to-br from-purple-50 to-violet-50"
  },
]

export default function Carousel() {
  const [index, setIndex] = useState(0)
  const autoplayRef = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    startAutoplay()
    return stopAutoplay
  }, [])

  useEffect(() => {
    stopAutoplay()
    startAutoplay()
  }, [index])

  function startAutoplay() {
    stopAutoplay()
    autoplayRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)
  }

  function stopAutoplay() {
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }

  function handleDragEnd(_event: unknown, info: { offset: { x: number } }) {
    const offset = info.offset.x
    if (offset < -50) setIndex((i) => Math.min(i + 1, slides.length - 1))
    if (offset > 50) setIndex((i) => Math.max(i - 1, 0))
  }

  const current = slides[index]

  return (
    <section className="min-h-[90vh] pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center" role="banner" aria-label="Hero section">
      <div className="max-w-7xl mx-auto w-full">
        <div ref={containerRef} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                drag="x"
                dragConstraints={containerRef}
                onDragEnd={handleDragEnd}
                whileTap={{ cursor: "grabbing" }}
                className={`rounded-3xl ${current.bg} p-8 sm:p-12 lg:p-16 shadow-xl border border-gray-100`}
              >
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                  {/* Content Side */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="order-2 lg:order-1"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-3" role="doc-subtitle">
                      InsureSense AI
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-gray-900 mb-4 leading-[1.1]">
                      {current.title}
                    </h1>
                    <h2 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent mb-6`}>
                      {current.subtitle}
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
                      {current.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button
                        className={`rounded-full bg-gradient-to-r ${current.gradient} hover:opacity-90 text-white font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all border-none`}
                        aria-label={`Get started with ${current.subtitle}`}
                      >
                        {current.cta}
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full border-2 border-gray-300 text-gray-700 font-semibold px-8 py-6 text-lg hover:bg-gray-100 transition-all"
                        aria-label={`Learn more about ${current.subtitle}`}
                      >
                        Learn More
                      </Button>
                    </div>
                  </motion.div>

                  {/* Image Side - mock card + floating badges */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="order-1 lg:order-2 flex justify-center"
                  >
                    <div className="relative w-full max-w-md lg:max-w-lg">
                      <div className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-12 rounded-3xl blur-3xl scale-105`} />

                      {/* Mock card artwork */}
                      <div className="relative w-full h-[360px] lg:h-[420px] flex items-center justify-center">
                        <img
                          src={current.img}
                          alt={`${current.subtitle} - InsureSense AI dashboard illustration`}
                          className="relative w-3/4 h-auto lg:w-full lg:h-full object-contain drop-shadow-2xl rounded-2xl"
                          loading="lazy"
                        />

                        {/* Floating badges (positioned over the mock card) */}
                        <motion.div
                          initial={{ x: 40, y: -30, opacity: 0 }}
                          animate={{ x: [40, 20, 40], y: [-30, -10, -30], opacity: [0, 1, 1] }}
                          transition={{ duration: 2.8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                          className="absolute right-4 top-6 bg-white/90 rounded-xl px-3 py-2 shadow-lg border border-purple-50"
                        >
                          <div className="text-xs text-gray-700 font-semibold">Airbnb room</div>
                          <div className="text-sm font-bold text-gray-900">$400.00</div>
                          <div className="mt-1 inline-flex gap-2">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">Personal</span>
                            <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded-full">Business</span>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ x: -40, y: 20, opacity: 0 }}
                          animate={{ x: [-40, -20, -40], y: [20, 0, 20], opacity: [0, 1, 1] }}
                          transition={{ duration: 3.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0.4 }}
                          className="absolute left-6 bottom-10 bg-white/95 rounded-xl px-3 py-2 shadow-lg border border-purple-50"
                        >
                          <div className="text-xs text-gray-700 font-semibold">Hostinger</div>
                          <div className="text-sm font-bold text-gray-900">$700.00</div>
                          <div className="mt-1 inline-flex gap-2">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">Personal</span>
                            <span className="text-xs px-2 py-0.5 bg-purple-600 text-white rounded-full">Business</span>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ x: 0, y: 60, opacity: 0 }}
                          animate={{ x: [0, 8, 0], y: [60, 40, 60], opacity: [0, 1, 1] }}
                          transition={{ duration: 3.6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 0.8 }}
                          className="absolute right-12 bottom-4 bg-white/95 rounded-xl px-3 py-2 shadow-lg border border-purple-50"
                        >
                          <div className="text-xs text-gray-700 font-semibold">Payment</div>
                          <div className="text-sm font-bold text-gray-900">₹1,200</div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="focus:outline-none transition-all duration-300 group"
              >
                {i === index ? (
                  <span className={`inline-block h-3 w-12 rounded-full bg-gradient-to-r ${current.gradient} shadow-md`} />
                ) : (
                  <span className="inline-block h-3 w-3 rounded-full border-2 border-gray-300 bg-white hover:border-purple-400 hover:scale-125 transition-all" />
                )}
              </button>
            ))}
          </div>

          {/* Navigation arrows removed per design request */}
        </div>
      </div>
    </section>
  )
}
