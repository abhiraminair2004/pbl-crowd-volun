import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react";
import ShareDialog from "@/components/volunteer/ShareDialog";

const VolunteerOpportunity = () => {
  const { id } = useParams<{ id: string }>();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const opportunity = {
    title: "Beach Cleanup Drive",
    organization: "EcoWarriors",
    location: "Mumbai, Maharashtra",
    date: "March 15, 2025",
    category: "Environment",
    image: "/placeholder.svg?height=400&width=600",
    description: "Join us for a day of beach cleanup to preserve our coastal environment. We'll be removing plastic waste, debris, and other pollutants from the shoreline.",
    requirements: "Bring sun protection, water bottle, and wear comfortable clothes. All cleaning equipment will be provided.",
    impact: "Last year, our volunteers collected over 500kg of waste from this beach. Your participation directly contributes to marine conservation efforts.",
    coordinator: "Priya Sharma",
    email: "contact@ecowarriors.org",
    phone: "+91 98765 43210",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-cream py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Button asChild variant="outline" className="mb-6">
              <Link to="/volunteer" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Opportunities
              </Link>
            </Button>
          </div>
          
          <Card>
            <CardHeader className="relative pb-0">
              <div className="absolute top-4 right-4 bg-secondary text-primary-dark text-xs font-medium px-2 py-1 rounded">
                {opportunity.category}
              </div>
              <div className="h-64 -mx-6 -mt-6 mb-4 relative rounded-t-lg overflow-hidden">
                <img 
                  src={opportunity.image} 
                  alt={opportunity.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-primary-dark mt-4">{opportunity.title}</CardTitle>
              <CardDescription className="text-lg font-medium">
                Organized by {opportunity.organization}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-12">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{opportunity.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>10 volunteers needed</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary-dark">About This Opportunity</h3>
                <p className="text-gray-700">{opportunity.description}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary-dark">Requirements</h3>
                <p className="text-gray-700">{opportunity.requirements}</p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-primary-dark">Impact</h3>
                <p className="text-gray-700">{opportunity.impact}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-primary-dark mb-2">Contact Information</h3>
                <p className="text-gray-700">Coordinator: {opportunity.coordinator}</p>
                <p className="text-gray-700">Email: {opportunity.email}</p>
                <p className="text-gray-700">Phone: {opportunity.phone}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between border-t pt-6">
              <Button asChild className="w-full sm:w-auto">
                <Link to="/volunteer/register">Apply as Volunteer</Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => setIsShareDialogOpen(true)}
              >
                Share This Opportunity
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        opportunityId={id || ""}
        opportunityTitle={opportunity.title}
      />
      
      <Footer />
    </div>
  );
};

export default VolunteerOpportunity;
