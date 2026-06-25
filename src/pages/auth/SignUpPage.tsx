
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CustomSelect } from "@/components/ui/custom-select"
import { Navbar } from "@/components/Navbar"
import { useAuth } from "@/context/AuthContext"

export default function SignUpPage() {
    const navigate = useNavigate()
    const { signup } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        age: "",
        occupation: "",
        familyMembers: "",
        password: "",
        confirmPassword: ""
    })

    const occupationOptions = [
        { label: "Service", value: "service" },
        { label: "Employed", value: "employed" },
        { label: "Unemployed", value: "unemployed" },
        { label: "Business", value: "business" },
        { label: "Freelancer", value: "freelancer" }
    ]

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, occupation: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!")
            return
        }
        setIsLoading(true)
        try {
            const name = `${formData.firstName} ${formData.lastName}`.trim() || formData.username
            await signup(formData.email, formData.password, name)
            navigate("/chat", { replace: true })
        } catch (err: any) {
            setError(err.message || "Sign up failed")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4 py-8 relative">
            <div className="absolute top-0 left-0 right-0">
                <Navbar />
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Create an Account</h1>
                    <p className="text-muted-foreground">Join us today! Enter your details below.</p>
                </div>

                {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                placeholder="johndoe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                required
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                required
                                placeholder="Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone No.</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                value={formData.age}
                                onChange={handleInputChange}
                                required
                                placeholder="25"
                                min="0"
                            />
                        </div>
                        <div className="space-y-2">
                            <CustomSelect
                                label="Occupation"
                                options={occupationOptions}
                                value={formData.occupation}
                                onChange={handleSelectChange}
                                placeholder="Select Occupation"
                            />
                            {/* Hidden input for validation if needed, or handle validation logic separately */}
                            <input
                                type="hidden"
                                required
                                value={formData.occupation}
                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Please select an occupation')}
                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="familyMembers">No. Family Members</Label>
                            <Input
                                id="familyMembers"
                                type="number"
                                value={formData.familyMembers}
                                onChange={handleInputChange}
                                required
                                placeholder="1"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="password">Create Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-lg mt-6"
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
                                Creating Account...
                            </motion.div>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-4">
                        Already have an account?{" "}
                        <Link to="/signin" className="text-primary hover:underline font-medium transition-colors">
                            Sign In
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
