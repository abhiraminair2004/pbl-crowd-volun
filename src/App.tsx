import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
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
import CampaignDetails from "./pages/crowdfunding/CampaignDetails";
import VolunteerAllOpportunities from "./pages/volunteer/VolunteerAllOpportunities";
import Profile from "./pages/Profile";
import VVerse from "./pages/VVerse";
import Navbar from "@/components/navbar";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Information Routes */}
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/about" element={<AboutUs />} />

              {/* VVerse Route */}
              <Route path="/vverse" element={<VVerse />} />

              {/* Volunteer Routes */}
              <Route path="/volunteer" element={<VolunteerPage />} />
              <Route path="/volunteer/register" element={<VolunteerRegister />} />
              <Route path="/volunteer/opportunity/:id" element={<VolunteerOpportunity />} />
              <Route path="/volunteer/thank-you" element={<VolunteerThankYou />} />
              <Route path="/volunteer/all" element={<VolunteerAllOpportunities />} />

              {/* Crowdfunding Routes */}
              <Route path="/crowdfunding" element={<CrowdfundingPage />} />
              <Route path="/crowdfunding/:id" element={<CampaignDetails />} />
              <Route path="/crowdfunding/donate/:id" element={<DonationForm />} />
              <Route path="/crowdfunding/thank-you" element={<DonationThankYou />} />
              <Route path="/crowdfunding/start" element={<StartCampaign />} />
              <Route path="/crowdfunding/all" element={<AllCampaigns />} />

              {/* Profile Route */}
              <Route path="/profile" element={<Profile />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
