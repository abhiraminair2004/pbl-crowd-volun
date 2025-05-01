import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCampaigns } from "@/services/api";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

const VolunteerAllOpportunities = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await getCampaigns();
        setCampaigns(data);
      } catch (err) {
        setError("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-cream py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tighter text-primary-dark mb-8">All Volunteer Opportunities</h2>
          {loading ? (
            <div className="text-center py-10">Loading opportunities...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign, index) => {
                const campaignId = campaign._id || campaign.id;
                return (
                  <div
                    key={campaignId || index}
                    className="border border-primary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    <div className="relative h-48">
                      <img
                        src={campaign.image || "/placeholder.svg?height=200&width=300"}
                        alt={campaign.title}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-3 right-3 bg-secondary text-primary-dark text-xs font-medium px-2 py-1 rounded">
                        {campaign.category}
                      </div>
                      {(campaign.status === 'completed' || campaign.status === 'cancelled') && (
                        <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">Closed</div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold text-lg text-primary-dark">{campaign.title}</h3>
                      <p className="text-primary-dark/70">{campaign.creator?.name || campaign.organization || 'Unknown Organization'}</p>
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{campaign.location || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'}</span>
                        </div>
                      </div>
                      {campaignId ? (
                        <Button asChild className="w-full mt-2 bg-primary text-white hover:bg-primary-dark hover:text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200">
                          <Link to={`/volunteer/opportunity/${campaignId}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Button disabled className="w-full mt-2">
                          Details Unavailable
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerAllOpportunities;