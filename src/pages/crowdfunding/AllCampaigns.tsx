import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Users, TrendingUp, Search, Filter, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import axios from "axios";
import { toast } from "sonner";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ETH_TO_INR = 1000;
const toINR = (eth: number) => eth * ETH_TO_INR;

const AllCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [onChainCampaigns, setOnChainCampaigns] = useState<any[]>([]);
  const [showDonate, setShowDonate] = useState<{ open: boolean; id: number | null; title?: string }>({ open: false, id: null, title: "" });
  const [donateAmount, setDonateAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [donorFirstName, setDonorFirstName] = useState("");
  const [donorLastName, setDonorLastName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postal, setPostal] = useState("");
  const [country, setCountry] = useState("");
  const [donateLoading, setDonateLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // TODO: Replace this with actual wallet/account logic (e.g., from MetaMask or backend)
  const currentUserAddress = (window.ethereum && window.ethereum.selectedAddress) ? window.ethereum.selectedAddress.toLowerCase() : "";

  useEffect(() => {
    async function fetchOnChainCampaigns() {
      try {
        const res = await axios.get("http://localhost:5000/api/crowdfunding/campaigns");
        setOnChainCampaigns(res.data);
      } catch (err) {
        // Optionally show an error
      }
    }
    fetchOnChainCampaigns();
  }, []);

  const filteredCampaigns = onChainCampaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (campaign.category || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setDonateLoading(true);
    setTimeout(() => {
      setDonateLoading(false);
      setShowDonate({ open: false, id: null, title: "" });

      // Simulate donation amount (convert INR to ETH before storing)
      const amountINR = parseFloat(donateAmount) || 0;
      const amountETH = amountINR / ETH_TO_INR;
      if (showDonate.id != null && amountETH > 0) {
        const key = `dummy-donations-campaign-${showDonate.id}`;
        let prev = { amount: 0, donors: 0 };
        try { prev = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
        const newAmount = prev.amount + amountETH;
        const newDonors = prev.donors + 1;
        localStorage.setItem(key, JSON.stringify({ raised: newAmount, supporters: newDonors }));
      }

      setDonateAmount("");
      setDonorFirstName("");
      setDonorLastName("");
      setDonorEmail("");
      setAddress1("");
      setAddress2("");
      setCity("");
      setState("");
      setPostal("");
      setCountry("");
      setCurrency("INR");
      setPaymentMethod("card");
      toast.success("Thank you for your (simulated) donation!");
    }, 1200);
  };

  const handleDelete = async (campaign: any) => {
    if (!window.confirm(`Are you sure you want to delete the campaign "${campaign.title}"?`)) return;
    setDeletingId(campaign.id);
    try {
      // Always treat as on-chain campaign
      await axios.delete(`http://localhost:5000/api/crowdfunding/campaigns/${campaign.id}`);
      // Re-fetch campaigns from backend to ensure UI is in sync
      const res = await axios.get("http://localhost:5000/api/crowdfunding/campaigns");
      setOnChainCampaigns(res.data);
      toast.success('On-chain campaign deleted!');
    } catch (err: any) {
      if (err?.response?.data?.error?.includes("Only creator can delete") || err?.message?.includes("Only creator can delete")) {
        toast.error("You can only delete campaigns you created.");
      } else {
        toast.error('Failed to delete campaign: ' + (err.response?.data?.error || err.message));
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header Section */}
      <section className="bg-secondary py-12">
        <div className="container px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary-dark">
              All Campaigns
            </h1>
            <p className="mt-2 text-primary-dark/80 md:text-lg max-w-3xl mx-auto">
              Browse all verified campaigns and support causes that matter to you
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search */}
      <section className="py-8 bg-cream">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-dark/50" />
                <input
                  type="text"
                  placeholder="Search campaigns"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 w-full"
                />
              </div>

              <Button variant="outline" className="border-secondary text-secondary flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign, index) => {
              const key = `dummy-donations-campaign-${campaign.id}`;
              let dummy = { amount: 0, donors: 0 };
              try { dummy = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
              const raisedETH = (campaign.raised || 0) + (dummy.amount || 0);
              const raisedINR = toINR(raisedETH);
              const goalINR = toINR(campaign.goal || campaign.targetAmount || 0);
              const progress = goalINR > 0 ? ((raisedINR / goalINR) * 100) : 0;
              return (
                <div
                  key={index}
                  className="border border-primary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="relative h-48">
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 bg-secondary text-primary-dark text-xs font-medium px-2 py-1 rounded z-10">
                      {campaign.category || (campaign.isOnChain ? "On-Chain" : "")}
                    </div>
                    {/* On-Chain Badge */}
                    {campaign.isOnChain && (
                      <div className="absolute top-10 left-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
                        On-Chain
                      </div>
                    )}
                    {/* Urgent Badge */}
                    {campaign.urgent && (
                      <div className="absolute top-16 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
                        Urgent
                      </div>
                    )}
                    {/* Closed Badge */}
                    {(campaign.completed || campaign.status === 'closed' || Number(campaign.goal) === 0) && (
                      <div className="absolute top-3 right-3 bg-gray-400 text-white text-xs font-medium px-2 py-1 rounded z-20">
                        Closed
                      </div>
                    )}
                    {/* Delete Button: Always show for testing/demo */}
                    <button
                      className="absolute top-3 right-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-2 z-20"
                      title="Delete Campaign"
                      onClick={() => handleDelete(campaign)}
                      disabled={deletingId === campaign.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <img
                      src={campaign.image || "/placeholder.svg?height=200&width=300"}
                      alt={campaign.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-primary-dark">{campaign.title}</h3>
                    <p className="text-primary-dark/70 text-sm line-clamp-2">{campaign.description}</p>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-secondary h-2.5 rounded-full"
                        style={{ width: `${Math.min(100, progress)}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="font-medium">₹{raisedINR.toLocaleString()}</span>
                      <span className="text-primary-dark/60">of ₹{goalINR.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm pt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span>{campaign.daysLeft ? `${campaign.daysLeft} days left` : ""}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-secondary" />
                        <span>{((campaign.supporters || 0) + (dummy.donors || 0))} supporters</span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-2 bg-secondary hover:bg-secondary-dark text-primary-dark"
                      onClick={() => setShowDonate({ open: true, id: campaign.id, title: campaign.title })}
                      disabled={campaign.completed || campaign.status === 'closed' || Number(campaign.goal) === 0}
                    >
                      {campaign.completed || campaign.status === 'closed' || Number(campaign.goal) === 0 ? 'Closed' : 'Donate Now'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Professional Donate Dialog */}
          {showDonate.open && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4">Donate to {showDonate.title}</h2>
                <form onSubmit={handleDonate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Donation Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Donation"
                        value={donateAmount}
                        onChange={e => setDonateAmount(e.target.value)}
                        className="border p-2 rounded w-full"
                        min="1"
                        required
                      />
                      <select value={currency} onChange={e => setCurrency(e.target.value)} className="border p-2 rounded">
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1">
                        <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                        <img src="https://img.icons8.com/color/32/000000/visa.png" alt="Visa" />
                        <img src="https://img.icons8.com/color/32/000000/mastercard-logo.png" alt="Mastercard" />
                        <img src="https://img.icons8.com/color/32/000000/amex.png" alt="Amex" />
                        <img src="https://img.icons8.com/color/32/000000/discover.png" alt="Discover" />
                      </label>
                      <label className="flex items-center gap-1">
                        <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} />
                        <img src="https://img.icons8.com/color/32/000000/paypal.png" alt="PayPal" />
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Donor's Name</label>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={donorFirstName}
                        onChange={e => setDonorFirstName(e.target.value)}
                        className="border p-2 rounded w-full mb-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={donorLastName}
                        onChange={e => setDonorLastName(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Donor's E-mail</label>
                      <input
                        type="email"
                        placeholder="ex: myname@example.com"
                        value={donorEmail}
                        onChange={e => setDonorEmail(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Donor's Address</label>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={address1}
                      onChange={e => setAddress1(e.target.value)}
                      className="border p-2 rounded w-full mb-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Address Line 2"
                      value={address2}
                      onChange={e => setAddress2(e.target.value)}
                      className="border p-2 rounded w-full mb-2"
                    />
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                      />
                      <input
                        type="text"
                        placeholder="State / Province"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Postal / Zip Code"
                        value={postal}
                        onChange={e => setPostal(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={country}
                        onChange={e => setCountry(e.target.value)}
                        className="border p-2 rounded w-full"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" type="button" onClick={() => setShowDonate({ open: false, id: null, title: "" })}>Cancel</Button>
                    <Button type="submit" disabled={donateLoading}>
                      {donateLoading ? "Processing..." : "Donate"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {filteredCampaigns.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No campaigns found matching your search criteria.</p>
              <Button
                variant="outline"
                className="mt-4 border-secondary text-secondary"
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllCampaigns;
