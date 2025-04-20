import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Users, TrendingUp, Search, Filter, ArrowRight, MapPin, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const VolunteerPage = () => {
  const opportunitiesRef = useRef<HTMLElement>(null);

  const scrollToOpportunities = (e: React.MouseEvent) => {
    e.preventDefault();
    opportunitiesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const volunteerOpportunities = [
    {
      title: "Beach Cleanup Drive",
      organization: "EcoWarriors",
      location: "Mumbai, Maharashtra",
      date: "March 15, 2025",
      category: "Environment",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Teaching Assistant for Underprivileged Children",
      organization: "Education For All",
      location: "Delhi, NCR",
      date: "Ongoing",
      category: "Education",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Medical Camp Volunteer",
      organization: "HealthFirst Foundation",
      location: "Bangalore, Karnataka",
      date: "April 5-6, 2025",
      category: "Healthcare",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Elderly Care Assistant",
      organization: "Silver Care",
      location: "Chennai, Tamil Nadu",
      date: "Weekends",
      category: "Elderly Care",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Animal Shelter Helper",
      organization: "Paws & Claws",
      location: "Pune, Maharashtra",
      date: "Flexible",
      category: "Animal Welfare",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      title: "Disaster Relief Volunteer",
      organization: "Rapid Response Team",
      location: "Hyderabad, Telangana",
      date: "On-call",
      category: "Disaster Relief",
      image: "/placeholder.svg?height=200&width=300",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-cream">
                Make a Difference Through Volunteering
              </h1>
              <p className="text-cream/90 md:text-xl">
                Connect with organizations and causes that match your skills and interests. Build a volunteering profile
                that showcases your impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary-dark text-primary-dark"
                  onClick={scrollToOpportunities}
                >
                  Find Opportunities
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-cream text-cream hover:bg-cream hover:text-primary-dark"
                >
                  <Link to="/volunteer/register">Register as Volunteer</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Volunteers working together"
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
              How Volunteering Works
            </h2>
            <p className="mt-4 text-primary-dark/80 md:text-lg max-w-3xl mx-auto">
              VeridaX makes it easy to find, apply for, and track your volunteering journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">Register</h3>
              <p className="text-primary-dark/70">
                Create your volunteer profile with your skills, interests, and availability.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">Find & Apply</h3>
              <p className="text-primary-dark/70">
                Browse opportunities that match your preferences and apply with a single click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-primary-dark mb-2">Track & Earn</h3>
              <p className="text-primary-dark/70">
                Log your volunteer hours, earn points, and build a verifiable volunteering record.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Opportunities */}
      <section id="opportunities" ref={opportunitiesRef} className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter text-primary-dark">Volunteer Opportunities</h2>
              <p className="text-primary-dark/70 mt-2">Browse and apply for opportunities that match your interests</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-dark/50" />
                <input
                  type="text"
                  placeholder="Search opportunities"
                  className="pl-10 pr-4 py-2 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-[200px]"
                />
              </div>

              <Button variant="outline" className="border-primary text-primary flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteerOpportunities.map((opportunity, index) => (
              <div
                key={index}
                className="border border-primary/10 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={opportunity.image}
                    alt={opportunity.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-3 right-3 bg-secondary text-primary-dark text-xs font-medium px-2 py-1 rounded">
                    {opportunity.category}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-lg text-primary-dark">{opportunity.title}</h3>
                  <p className="text-primary-dark/70">{opportunity.organization}</p>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{opportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{opportunity.date}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full mt-2">
                    <Link to={`/volunteer/opportunity/${index}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" size="lg" className="border-primary text-primary">
              <Link to="/volunteer/all">View All Opportunities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-primary-dark">
              Benefits of Volunteering with VeridaX
            </h2>
            <p className="mt-4 text-primary-dark/80 md:text-lg max-w-3xl mx-auto">
              Volunteering is not just about giving back—it's also about personal growth and opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary-dark mb-4">For Volunteers</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Build a verified volunteering profile for scholarships and career opportunities</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Earn points redeemable for vouchers and special offers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Develop new skills and gain practical experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Connect with like-minded individuals and expand your network</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-primary-dark mb-4">For Organizations</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Access a pool of skilled and passionate volunteers</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Streamlined volunteer management tools and analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Increased visibility and outreach for your cause</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Potential partnerships and funding opportunities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-cream">
                Ready to Start Your Volunteering Journey?
              </h2>
              <p className="mx-auto max-w-[700px] text-cream/80 md:text-xl">
                Join thousands of volunteers making a difference in their communities and beyond.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary-dark text-primary-dark">
                <Link to="/volunteer/register">Register as Volunteer</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-cream text-cream hover:bg-cream hover:text-primary-dark"
              >
                <Link to="/volunteer/organizations">For Organizations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VolunteerPage;
