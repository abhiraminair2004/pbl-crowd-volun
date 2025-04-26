import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Users, TrendingUp, Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import axios from "axios";

const CrowdfundingPage = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await axios.get("http://localhost:5000/api/crowdfunding/campaigns");
        setCampaigns(res.data.campaigns || res.data); // adjust if backend returns differently
      } catch (err) {
        // Optionally show an error
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  console.log("Fetched campaigns:", campaigns);
  console.log(
    "Filtered out campaigns:",
    campaigns.filter(
      campaign =>
        !(
          (typeof campaign.id === 'number' && campaign.id > 0) ||
          (typeof campaign.id === 'string' && campaign.id !== '0' && campaign.id.length > 0) ||
          (typeof campaign._id === 'string' && campaign._id.length > 0)
        )
    )
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-secondary py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-primary-dark">
                Trusted Crowdfunding for Meaningful Causes
              </h1>
              <p className="text-primary-dark/90 md:text-xl">
                Support verified campaigns for education, medical needs, sports, and more. Every contribution makes a
                difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-cream">
                  <Link to="#campaigns">Explore Campaigns</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-cream"
                >
                  <Link to="/crowdfunding/start">Start a Campaign</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <img
                src="/images/community-hands.jpg"
                alt="Diverse group of people joining hands together in unity and support"
                className="object-cover h-full w-full"
              />

            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-cream">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary-dark">
              How Our Crowdfunding Works
            </h2>
            <p className="mt-4 text-primary-dark/80 md:text-lg max-w-3xl mx-auto">
              VeridaX ensures transparency and trust in every campaign.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">Verification</h3>
              <p className="text-primary-dark/70">
                All campaigns undergo thorough verification before being posted on our platform.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-secondary-dark" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">Prioritization</h3>
              <p className="text-primary-dark/70">
                Urgent cases are highlighted and displayed first to ensure timely support.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-secondary-dark" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">Rewards</h3>
              <p className="text-primary-dark/70">
                Earn points for your contributions that can be redeemed for offers and vouchers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section id="campaigns" className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter text-primary-dark">Current Campaigns</h2>
              <p className="text-primary-dark/70 mt-2">Browse verified campaigns and make a difference today</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-dark/50" />
                <input
                  type="text"
                  placeholder="Search campaigns"
                  className="pl-10 pr-4 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-[200px]"
                />
              </div>

              <Button variant="outline" className="border-secondary text-secondary flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div>Loading campaigns...</div>
            ) : campaigns.length === 0 ? (
              <div>No campaigns found.</div>
            ) : (
              campaigns
                .filter(
                  campaign =>
                    (typeof campaign.id === 'number' && campaign.id > 0) ||
                    (typeof campaign.id === 'string' && campaign.id !== '0' && campaign.id.length > 0) ||
                    (typeof campaign._id === 'string' && campaign._id.length > 0)
                )
                .map((campaign, index) => (
                  <div key={campaign.id || campaign._id || index} className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
                    <img
                      src={campaign.image || "/placeholder.svg?height=200&width=300"}
                      alt={campaign.title}
                      className="rounded-md mb-4 h-48 object-cover"
                    />
                    <h3 className="text-xl font-bold text-primary-dark mb-2">{campaign.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{campaign.description}</p>
                    <div className="flex items-center gap-2 text-sm text-primary-dark/70 mb-2">
                      <span>Goal: {campaign.goal || campaign.targetAmount} ETH</span>
                    </div>
                    {/* Add more campaign details as needed */}
                    <Button asChild className="mt-auto bg-primary text-cream hover:bg-primary-dark">
                      <Link to={`/crowdfunding/${campaign.id || campaign._id}`}>View Details</Link>
                    </Button>
                  </div>
                ))
            )}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="border-secondary text-secondary">
              <Link to="/crowdfunding/all">View All Campaigns</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-16 bg-primary/10">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary-dark">Trust & Transparency</h2>
            <p className="mt-4 text-primary-dark/80 md:text-lg max-w-3xl mx-auto">
              At VeridaX, we ensure every campaign is legitimate and every rupee is accounted for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary-dark mb-4">Our Verification Process</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Document verification to confirm the authenticity of the cause</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Background checks on campaign creators and beneficiaries</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Regular updates and proof of fund utilization</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Third-party audits to ensure transparency</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary-dark mb-4">Your Contribution Impact</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Track exactly how your donation is being utilized</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Receive regular updates on the progress of the campaign</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Earn points for your contributions that can be redeemed</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Get tax benefits for eligible donations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary-dark">
                Ready to Make a Difference?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-dark/80 md:text-xl">
                Join thousands of donors supporting verified causes and creating real impact.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-cream">
                <Link to="/crowdfunding/campaigns">Donate Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-cream"
              >
                <Link to="/crowdfunding/start">Start a Campaign</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CrowdfundingPage;
