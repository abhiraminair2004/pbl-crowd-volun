import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MapPin, Calendar, Users, ArrowLeft, Heart } from "lucide-react";
import axios from "axios";

const CampaignDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching campaign details for ID:", id);
    async function fetchCampaignDetails() {
      try {
        const res = await axios.get(`http://localhost:5000/api/crowdfunding/campaigns/${id}`);
        console.log("Campaign details response:", res.data);
        if (res.data.success && res.data.details) {
          setCampaign(res.data.details);
          setError(null);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError("Failed to load campaign details");
      } finally {
        setLoading(false);
      }
    }
    fetchCampaignDetails();
  }, [id]);

  console.log("Current campaign state:", campaign);
  console.log("Loading state:", loading);
  console.log("Error state:", error);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div>Loading campaign details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-primary-dark mb-4">Campaign Not Found</h2>
            <p className="text-primary-dark/70 mb-6">{error || "The campaign you're looking for doesn't exist."}</p>
            <Button asChild>
              <Link to="/crowdfunding">Back to Campaigns</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-cream py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/crowdfunding" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Campaigns
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary-dark">{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative h-64 rounded-md overflow-hidden">
                    <img
                      src={campaign.image || "/placeholder.svg?height=400&width=600"}
                      alt={campaign.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-secondary" />
                      <span className="text-primary-dark/70">Created by: {campaign.creator}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-secondary" />
                      <span className="text-primary-dark/70">
                        Deadline: {campaign.deadline && !isNaN(Number(campaign.deadline)) && Number(campaign.deadline) > 0
                          ? new Date(Number(campaign.deadline) * 1000).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-dark/70">Progress</span>
                      <span className="font-medium">
                        {campaign.goal && Number(campaign.goal) > 0
                          ? ((Number(campaign.raised) / Number(campaign.goal)) * 100).toFixed(1) + "%"
                          : "0%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-secondary h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(100, (Number(campaign.raised) / Number(campaign.goal)) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{campaign.raised || 0} ETH raised</span>
                      <span className="text-primary-dark/70">Goal: {campaign.goal || 0} ETH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary-dark">Support This Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild className="w-full bg-primary text-cream hover:bg-primary-dark">
                    <Link to={`/crowdfunding/donate/${id}`}>
                      Donate Now
                      <Heart className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CampaignDetails;