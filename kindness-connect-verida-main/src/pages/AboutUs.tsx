
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Abhirami Nair",
      role: "Co-Founder",
      bio: "Passionate leader driving innovative solutions for social impact.",
      image: "https://source.unsplash.com/random/300x300/?portrait&woman=1"
    },
    {
      name: "Aditi Bansal",
      role: "Co-Founder",
      bio: "Strategic thinker committed to creating meaningful change globally.",
      image: "https://source.unsplash.com/random/300x300/?portrait&woman=2"
    },
    {
      name: "Aparna Nair",
      role: "Co-Founder",
      bio: "Visionary entrepreneur focused on empowering communities.",
      image: "https://source.unsplash.com/random/300x300/?portrait&woman=3"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-cream py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-primary-dark mb-4">About VeridaX</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Connecting passionate individuals with meaningful causes to create lasting positive change around the world.
            </p>
          </div>
          
          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">Our Mission</h2>
                <p className="text-gray-700">
                  At VeridaX, we're on a mission to democratize philanthropy and volunteerism, 
                  making it easier for everyone to contribute to causes they care about, regardless 
                  of their location or resources. We believe that small actions, when multiplied, 
                  can transform communities and change lives.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">Our Vision</h2>
                <p className="text-gray-700">
                  We envision a world where every person has the opportunity to make a meaningful 
                  impact, where geographic and economic barriers no longer limit one's ability to 
                  help others, and where technology serves as a bridge connecting those who want 
                  to help with those who need it most.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Our Story */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary-dark mb-6 text-center">Our Story</h2>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <p className="text-gray-700 mb-4">
                The idea was first formulated by Abhirami back in school, a spark of inspiration 
                that would later grow into something much larger. Everything came together with 
                better ideas when Abhirami, Aditi, and Aparna joined hands in college and 
                collectively expanded on the initial concept.
              </p>
              <p className="text-gray-700 mb-4">
                What began as a collaborative vision soon transformed into a platform dedicated 
                to connecting passionate individuals with meaningful causes. Their shared commitment 
                to creating social impact drove them to develop a system that would make volunteering 
                and fundraising more accessible and efficient.
              </p>
              <p className="text-gray-700">
                Today, VeridaX operates in over 50 countries, has facilitated more than 100,000 
                volunteer placements, and helped raise millions for causes ranging from education 
                initiatives to environmental conservation projects.
              </p>
            </div>
          </div>
          
          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary-dark mb-6 text-center">Our Founders</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-primary-dark">{member.name}</h3>
                    <p className="text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Impact */}
          <div className="bg-white p-8 rounded-lg shadow-sm mb-16">
            <h2 className="text-3xl font-bold text-primary-dark mb-6 text-center">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <p className="text-gray-700 font-medium">Countries Served</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100K+</div>
                <p className="text-gray-700 font-medium">Volunteer Placements</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">$25M+</div>
                <p className="text-gray-700 font-medium">Funds Raised</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
