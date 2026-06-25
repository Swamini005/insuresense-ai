import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/context/AuthContext"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import LandingPage from "@/pages/LandingPage"
import ChatPage from "@/pages/ChatPage"
import TravelInsurancePage from "@/pages/TravelInsurancePage"
import HealthInsurancePage from "@/pages/HealthInsurancePage"
import LifeInsurancePage from "@/pages/LifeInsurancePage"
import InvestmentPage from "@/pages/InvestmentPage"
import CryptoPage from "@/pages/CryptoPage"
import RecommendationsPage from "@/pages/RecommendationsPage"
import SignInPage from "@/pages/auth/SignInPage"
import SignUpPage from "@/pages/auth/SignUpPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Dashboard (requires login) */}
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/chat/:agentId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/travel" element={<ProtectedRoute><TravelInsurancePage /></ProtectedRoute>} />
          <Route path="/health" element={<ProtectedRoute><HealthInsurancePage /></ProtectedRoute>} />
          <Route path="/life" element={<ProtectedRoute><LifeInsurancePage /></ProtectedRoute>} />
          <Route path="/investment" element={<ProtectedRoute><InvestmentPage /></ProtectedRoute>} />
          <Route path="/crypto" element={<ProtectedRoute><CryptoPage /></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><RecommendationsPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
