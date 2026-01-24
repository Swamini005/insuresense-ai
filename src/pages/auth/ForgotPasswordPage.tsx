
import { useState } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, ArrowLeft, Mail } from "lucide-react"
import { Navbar } from "@/components/Navbar"

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)
    const [email, setEmail] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Mock SMTP/Service delay
        setTimeout(() => {
            setIsLoading(false)
            setIsSent(true)
        }, 2000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 relative">
            <div className="absolute top-0 left-0 right-0">
                <Navbar />
            </div>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg border border-border overflow-hidden relative"
            >
                <AnimatePresence mode="wait">
                    {!isSent ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-2">
                                <Link to="/signin" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
                                </Link>
                                <h1 className="text-2xl font-bold tracking-tight text-primary">Forgot Password?</h1>
                                <p className="text-muted-foreground">
                                    Enter your email address and we'll connect to our SMTP service to send you a reset link.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <Button type="submit" className="w-full text-lg" disabled={isLoading} size="lg">
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Connecting to SMTP...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Send Reset Link
                                        </div>
                                    )}
                                </Button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center text-center space-y-6 py-8"
                        >
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-primary">Link Sent!</h2>
                                <p className="text-muted-foreground">
                                    We have sent a password reset link to <br />
                                    <span className="font-medium text-foreground">{email}</span>
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Did not receive the email? Check your spam filter or{" "}
                                <button onClick={() => setIsSent(false)} className="text-primary hover:underline font-medium">try another email address</button>.
                            </p>
                            <div className="pt-4 w-full">
                                <Link to="/signin">
                                    <Button variant="outline" className="w-full">Return to Sign In</Button>
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
