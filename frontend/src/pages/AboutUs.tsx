import React from 'react';
import { Card, CardContent } from '../components/ui/card';

const AboutUs: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">About VeridaX</h1>
        <p className="text-xl text-gray-700">
          Connecting passionate individuals with meaningful volunteer opportunities
        </p>
      </section>

      {/* Mission and Vision Section */}
      <section className="mb-12">
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              To make volunteering accessible and impactful for everyone
            </p>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-gray-700">
              To create a world where everyone can contribute to positive change
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Story Section */}
      <section className="mb-12">
        <Card>
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700">
              The idea was first formulated by Abhirami, who saw the need for a better way to connect volunteers with organizations.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Team Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Our Founders</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Abhirami Nair */}
          <Card>
            <CardContent>
              <img
                src="/team/abhirami.jpg"
                alt="Abhirami Nair"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Abhirami Nair</h3>
              <a
                href="https://www.linkedin.com/in/abhirami-nair"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn Profile
              </a>
            </CardContent>
          </Card>

          {/* Aditi Bansal */}
          <Card>
            <CardContent>
              <img
                src="/team/aditi.jpg"
                alt="Aditi Bansal"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Aditi Bansal</h3>
              <a
                href="https://www.linkedin.com/in/aditi-bansal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn Profile
              </a>
            </CardContent>
          </Card>

          {/* Aparna Nair */}
          <Card>
            <CardContent>
              <img
                src="/team/aparna.jpg"
                alt="Aparna Nair"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Aparna Nair</h3>
              <a
                href="https://www.linkedin.com/in/aparna-nair"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn Profile
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;