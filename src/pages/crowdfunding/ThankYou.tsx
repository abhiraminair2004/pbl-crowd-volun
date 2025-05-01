import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";

const DonationThankYouPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-cream flex items-center justify-center py-20">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-8 h-8 text-green-600"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-primary-dark mb-4">Thank You for Your Donation!</h1>

            <p className="text-lg text-gray-700 mb-6 max-w-lg mx-auto">
              Your generosity will help make a real difference. We've sent a confirmation receipt to your email.
            </p>

            <div className="bg-secondary/20 p-6 rounded-lg mb-6 max-w-md mx-auto">
              <h3 className="font-semibold text-primary-dark mb-2">You've earned 50 VeridaX points!</h3>
              <p className="text-sm text-gray-600">
                These points can be redeemed for special offers and vouchers in your account.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Would you like to explore more ways to make an impact?
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/crowdfunding">Browse More Campaigns</Link>
                </Button>

                <Button asChild variant="outline">
                  <Link to="/volunteer">Volunteer Opportunities</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DonationThankYouPage;
