import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VolunteerPage from "./pages/volunteer/VolunteerPage";
import VolunteerRegister from "./pages/volunteer/VolunteerRegister";
import VolunteerOpportunity from "./pages/volunteer/VolunteerOpportunity";
import VolunteerThankYou from "./pages/volunteer/ThankYou";
import CrowdfundingPage from "./pages/crowdfunding/CrowdfundingPage";
import DonationForm from "./pages/crowdfunding/DonationForm";
import DonationThankYou from "./pages/crowdfunding/ThankYou";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/ForgotPassword";
import TermsConditions from "./pages/TermsConditions";
import AboutUs from "./pages/AboutUs";
import StartCampaign from "./pages/crowdfunding/StartCampaign";
import AllCampaigns from "./pages/crowdfunding/AllCampaigns";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Information Routes */}
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/about" element={<AboutUs />} />
            
            {/* Volunteer Routes */}
            <Route path="/volunteer" element={<VolunteerPage />} />
            <Route path="/volunteer/register" element={<VolunteerRegister />} />
            <Route path="/volunteer/opportunity/:id" element={<VolunteerOpportunity />} />
            <Route path="/volunteer/thank-you" element={<VolunteerThankYou />} />
            
            {/* Crowdfunding Routes */}
            <Route path="/crowdfunding" element={<CrowdfundingPage />} />
            <Route path="/crowdfunding/donate/:id" element={<DonationForm />} />
            <Route path="/crowdfunding/thank-you" element={<DonationThankYou />} />
            <Route path="/crowdfunding/start" element={<StartCampaign />} />
            <Route path="/crowdfunding/all" element={<AllCampaigns />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
