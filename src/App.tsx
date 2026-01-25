import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import ChatPage from "@/pages/ChatPage"
import TravelInsurancePage from "@/pages/TravelInsurancePage"
import HealthInsurancePage from "@/pages/HealthInsurancePage"
import LifeInsurancePage from "@/pages/LifeInsurancePage"
import InvestmentPage from "@/pages/InvestmentPage"
import RecommendationsPage from "@/pages/RecommendationsPage"
import SignInPage from "@/pages/auth/SignInPage"
import SignUpPage from "@/pages/auth/SignUpPage"
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/travel-insurance" element={<TravelInsurancePage />} />
        <Route path="/health-insurance" element={<HealthInsurancePage />} />
        <Route path="/life-insurance" element={<LifeInsurancePage />} />
        <Route path="/investment-insurance" element={<InvestmentPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  )
}

export default App
