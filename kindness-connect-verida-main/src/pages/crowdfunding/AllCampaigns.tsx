
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Users, TrendingUp, Search, Filter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const AllCampaigns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const campaigns = [
    {
      title: "Medical Treatment for Ravi",
      category: "Medical",
      description: "Help 8-year-old Ravi get the critical heart surgery he needs to live a normal life.",
      raised: 350000,
      goal: 500000,
      daysLeft: 15,
      supporters: 128,
      image: "/placeholder.svg?height=200&width=300",
      urgent: true,
    },
    {
      title: "College Scholarship Fund",
      category: "Education",
      description: "Support bright students from underprivileged backgrounds to pursue higher education.",
      raised: 250000,
      goal: 1000000,
      daysLeft: 45,
      supporters: 87,
      image: "/placeholder.svg?height=200&width=300",
      urgent: false,
    },
    {
      title: "Sports Equipment for Rural School",
      category: "Sports",
      description: "Help provide sports equipment to a rural school to encourage physical fitness and team building.",
      raised: 75000,
      goal: 150000,
      daysLeft: 30,
      supporters: 42,
      image: "/placeholder.svg?height=200&width=300",
      urgent: false,
    },
    {
      title: "Emergency Flood Relief",
      category: "Disaster Relief",
      description: "Support families affected by recent floods with essential supplies and temporary shelter.",
      raised: 420000,
      goal: 600000,
      daysLeft: 7,
      supporters: 215,
      image: "/placeholder.svg?height=200&width=300",
      urgent: true,
    },
    {
      title: "Community Art Center",
      category: "Arts & Culture",
      description: "Help establish a community art center to provide creative outlets for children and adults.",
      raised: 180000,
      goal: 400000,
      daysLeft: 60,
      supporters: 65,
      image: "/placeholder.svg?height=200&width=300",
      urgent: false,
    },
    {
      title: "Clean Water Project",
      category: "Environment",
      description: "Support the installation of water purification systems in villages without access to clean water.",
      raised: 320000,
      goal: 500000,
      daysLeft: 25,
      supporters: 110,
      image: "/placeholder.svg?height=200&width=300",
      urgent: false,
    },
    {
      title: "Elderly Care Facility",
      category: "Healthcare",
      description: "Support the construction of a new wing at an elderly care facility to accommodate more residents.",
      raised: 580000,
      goal: 800000,
      daysLeft: 35,
      supporters: 145,
      image: "/placeholder.svg?height=200&width=300",
      urgent: false,
    },
    {
      title: "Wildlife Conservation",
      category: "Environment",
      description: "Help protect endangered species and their habitats through conservation efforts.",
      raised: 210000,
      goal: 450000,
      daysLeft: 40,
      supporters: 95,
      image: "/placeholder.svg?height=200&width=300",
      urgent: false,
    },
    {
      title: "Women's Empowerment Program",
      category: "Social",
      description: "Support skill development and employment opportunities for underprivileged women.",
      raised: 290000,
      goal: 400000,
      daysLeft: 20,
      supporters: 130,
      image: "/placeholder.svg?height=200&width=300",
      urgent: false,
    },
  ];

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    campaign.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            {filteredCampaigns.map((campaign, index) => (
              <div
                key={index}
                className="border border-primary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-3 right-3 bg-secondary text-primary-dark text-xs font-medium px-2 py-1 rounded">
                    {campaign.category}
                  </div>
                  {campaign.urgent && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Urgent
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg text-primary-dark">{campaign.title}</h3>
                  <p className="text-primary-dark/70 text-sm line-clamp-2">{campaign.description}</p>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-secondary h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="font-medium">₹{campaign.raised.toLocaleString()}</span>
                    <span className="text-primary-dark/60">of ₹{campaign.goal.toLocaleString()}</span>
                  </div>

                  <div className="flex flex-col gap-2 text-sm pt-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-secondary" />
                      <span>{campaign.daysLeft} days left</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-secondary" />
                      <span>{campaign.supporters} supporters</span>
                    </div>
                  </div>

                  <Button asChild className="w-full mt-2 bg-secondary hover:bg-secondary-dark text-primary-dark">
                    <Link to={`/crowdfunding/donate/${index}`}>
                      Donate Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

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
