import { motion } from "framer-motion"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import Carousel from "@/components/Carousel"
import LogosStrip from "@/components/LogosStrip"
import InsureSenseFAQ from "@/components/InsureSenseFAQ"
import { Card, CardContent } from "@/components/ui/card"
import StackedCards from "@/components/StackedCards"
import { useEffect } from "react"
import Lenis from "@studio-freight/lenis"

export default function LandingPage() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background orbs removed — page uses plain white background now */}
      
      <div className="relative z-10">
        <Navbar />
      
        {/* Hero Carousel */}
        <Carousel />

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-purple-50/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8"
            >
              How It Works
            </motion.h2>
          </div>
          {/* Stacked sticky/parallax cards demo */}
          <StackedCards />
        </section>

        {/* Trust & Safety Section */}
        <section id="trust-safety" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-violet-50 to-purple-50/80 backdrop-blur-sm" role="region" aria-labelledby="trust-heading">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            id="trust-heading"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 mb-8 sm:mb-12 lg:mb-16"
          >
            Trust & Safety
          </motion.h2>
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center mb-8 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full"
            >
              <img
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=1200&fit=crop"
                alt="Security and trust - InsureSense secure insurance platform"
                className="rounded-2xl w-full h-[280px] sm:h-[380px] lg:h-[480px] object-cover shadow-lg"
                loading="lazy"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center h-full"
            >
              <LogosStrip />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 sm:mt-16 lg:mt-24"
          >
            <InsureSenseFAQ />
          </motion.div>
        </div>
      </section>

        {/* Contact Section - Shastra Style */}
        <section id="contact" className="py-24 lg:py-32 px-4 relative overflow-hidden bg-gradient-to-br from-purple-100/60 via-violet-50/50 to-purple-100/40 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-purple-600 mb-4" role="doc-subtitle">
                  REACH OUT
                </p>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-[-0.02em] text-gray-900 mb-8 leading-none">
                  SENSE THE<br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-600 text-6xl lg:text-8xl">FUTURE</span>
                </h2>
                <div className="space-y-6">
                  <p className="text-xl text-gray-600 max-w-md">
                    Have questions about AI-driven insurance? Our team is here to help you navigate the new risk landscape.
                  </p>
                  <div className="flex flex-col gap-4">
                    <a
                      href="mailto:hello@insuresense.ai"
                      className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors"
                      aria-label="Email us at hello@insuresense.ai"
                    >
                      hello@insuresense.ai
                    </a>
                  </div>
                </div>
              </div>
              
              <Card className="rounded-3xl border-2 border-purple-100 shadow-2xl overflow-hidden bg-purple-50/50 backdrop-blur-xl">
                <CardContent className="p-8 sm:p-12">
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 uppercase tracking-widest pl-1">Name</label>
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="w-full bg-white border-2 border-purple-100 rounded-2xl px-6 py-4 outline-none focus:border-purple-600 transition-all text-gray-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 uppercase tracking-widest pl-1">Email</label>
                      <input 
                        type="email" 
                        placeholder="name@company.com" 
                        className="w-full bg-white border-2 border-purple-100 rounded-2xl px-6 py-4 outline-none focus:border-purple-600 transition-all text-gray-900" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900 uppercase tracking-widest pl-1">Message</label>
                      <textarea 
                        rows={4} 
                        placeholder="Tell us about your needs..." 
                        className="w-full bg-white border-2 border-purple-100 rounded-2xl px-6 py-4 outline-none focus:border-purple-600 transition-all text-gray-900 resize-none" 
                      />
                    </div>
                    <Button className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-bold py-8 text-lg shadow-xl hover:shadow-2xl transition-all border-none">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer - Shastra Style */}
        <footer className="bg-white py-16 px-4 border-t border-gray-100 text-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 sm:col-span-2">
                <h3 className="text-3xl font-black mb-6 tracking-tighter">InsureSense</h3>
                <p className="text-gray-500 max-w-xs text-lg">
                  AI that senses when to insure and where to insure. Join the data-driven insurance revolution.
                </p>
                <div className="flex gap-4 mt-8">
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all cursor-pointer">X</div>
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all cursor-pointer">In</div>
                  <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all cursor-pointer">Gh</div>
                </div>
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest mb-6">Product</h4>
                <ul className="text-gray-500 space-y-3 font-semibold">
                  <li><a href="#how-it-works" className="hover:text-purple-600 transition-colors">Risk Engine</a></li>
                  <li><a href="#trust-safety" className="hover:text-purple-600 transition-colors">Trust Data</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-sm uppercase tracking-widest mb-6">Company</h4>
                <ul className="text-gray-500 space-y-3 font-semibold">
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-purple-600 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="text-center text-gray-400 font-bold text-xs tracking-widest uppercase">
              <p>&copy; 2026 InsureSense. Built with context-aware AI.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}