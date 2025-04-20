import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import StartCampaign from "./pages/crowdfunding/StartCampaign";
import AllCampaigns from "./pages/crowdfunding/AllCampaigns";

createRoot(document.getElementById("root")!).render(<App />);
