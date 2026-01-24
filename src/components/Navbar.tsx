import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isChatPage = location.pathname === "/chat"

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "w-full transition-all duration-300 py-4 px-6 md:px-8",
        scrolled && "shadow-sm bg-white/80 backdrop-blur-md sticky top-0 z-40"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group relative z-50">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200">
            IS
          </div>
          <div className="text-lg font-bold tracking-tight">
            <span className="text-gray-900">Insure</span>
            <span className="text-blue-600">Sense</span>
          </div>
        </Link>

        {/* Right Section - Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          {!isChatPage && (
            <>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
              >
                Log in
              </Button>
              <Button
                className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 shadow-md shadow-blue-200/50 transition-all hover:scale-105"
                onClick={() => navigate('/chat')}
              >
                Get Started
              </Button>
            </>
          )}
          {isChatPage && (
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
            >
              Log out
            </Button>
          )}
        </div>

        {/* Mobile menu button - Hide on Chat Page to avoid conflict with Sidebar toggle */}
        {!isChatPage && (
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors relative z-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        )}
      </div>

      {/* Mobile menu Overlay */}
      <AnimatePresence>
        {mobileOpen && !isChatPage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl overflow-hidden z-40"
          >
            <div className="flex flex-col p-6 gap-4">
              <Button
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 shadow-lg shadow-blue-200/30"
                onClick={() => {
                  navigate('/chat')
                  setMobileOpen(false)
                }}
              >
                Get Started
              </Button>
              <Button variant="outline" className="w-full rounded-xl py-6 border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 text-gray-700">
                Log in
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
