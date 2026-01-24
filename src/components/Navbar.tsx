import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#trust-safety", label: "Trust & safety" },
  { href: "#contact", label: "Contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="max-w-6xl mx-auto px-4">
        <nav
          className={cn(
            "flex items-center justify-between px-6 rounded-full bg-white/20 backdrop-blur-md border border-purple-300/60 transition-all duration-300",
            scrolled ? "py-2 px-4 shadow-xl shadow-purple-200/20" : "py-3",
          )}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo (clickable) */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
              IS
            </div>
            <div className="text-lg font-semibold tracking-tight flex gap-1">
              <span className="text-blue-900 group-hover:text-blue-800">Insure</span>
              <span className="text-blue-800 group-hover:text-blue-700">Sense</span>
            </div>
          </a>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-800 hover:text-purple-600 transition-colors relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-purple-600 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right Section - CTA */}
          <div className="flex items-center gap-3">
            <Link to="/signin" className="hidden sm:block text-sm font-medium text-gray-800 hover:text-purple-600 px-4 py-2 transition-colors">
              Sign In
            </Link>
            <Link to="/signup">
              <Button className="rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 shadow-lg shadow-purple-200/60 transition-all">
                Sign Up
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="flex lg:hidden ml-2 p-2 hover:bg-purple-50 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5 text-purple-600" /> : <Menu className="h-5 w-5 text-purple-600" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden mt-3 mx-4 border-2 border-purple-600 rounded-2xl bg-white shadow-sm transition-all duration-300 overflow-hidden max-w-6xl mx-auto",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 text-sm font-medium text-gray-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <hr className="my-2 border-purple-200" />
          <Link
            to="/signin"
            onClick={() => setMobileOpen(false)}
            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-800 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            Sign In
          </Link>
          <Link to="/signup" onClick={() => setMobileOpen(false)}>
            <Button className="w-full rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium mt-2">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
