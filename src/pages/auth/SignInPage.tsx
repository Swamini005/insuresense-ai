
import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/Navbar"

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Mock API call
        setTimeout(() => {
            setIsLoading(false)
            alert("Sign in successful! (Mock)")
        }, 1500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 relative">
            <div className="absolute top-0 left-0 right-0">
                <Navbar />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username or Email</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                to="/forgot-password"
                                className="text-sm font-medium text-primary hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-lg mt-2"
                        disabled={isLoading}
                        size="lg"
                    >
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-2"
                            >
                                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                Signing In...
                            </motion.div>
                        ) : "Sign In"}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-primary hover:underline font-medium transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
