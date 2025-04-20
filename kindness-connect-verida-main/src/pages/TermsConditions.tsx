
import React from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const TermsConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-cream py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold text-primary-dark mb-6">Terms and Conditions</h1>
            
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">1. Introduction</h2>
                <p>
                  Welcome to VeridaX. By using our platform, you agree to these Terms and Conditions, 
                  which constitute a legally binding agreement between you and VeridaX.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">2. Definitions</h2>
                <p>
                  "VeridaX," "we," "us," and "our" refer to VeridaX and its subsidiaries, affiliates, 
                  officers, directors, employees, agents, and contractors.
                </p>
                <p>
                  "Platform" refers to our website, mobile applications, and any other services provided by VeridaX.
                </p>
                <p>
                  "User," "you," and "your" refer to individuals who use our Platform, whether as a donor, 
                  volunteer, campaign creator, or visitor.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">3. Account Registration</h2>
                <p>
                  To access certain features of our Platform, you may need to register for an account. 
                  You agree to provide accurate, current, and complete information during the registration 
                  process and to update such information to keep it accurate, current, and complete.
                </p>
                <p>
                  You are solely responsible for safeguarding your account password and for any activity 
                  that occurs under your account. You agree to notify us immediately of any unauthorized 
                  use of your account.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">4. Donations</h2>
                <p>
                  All donations are final and non-refundable. By making a donation, you acknowledge that 
                  you are doing so voluntarily and that you have no expectation of compensation, payment, 
                  or reward.
                </p>
                <p>
                  VeridaX charges a platform fee of 5% of each donation to cover operational costs. 
                  This fee is clearly disclosed during the donation process.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">5. Volunteering</h2>
                <p>
                  By registering as a volunteer, you agree to provide accurate information about your 
                  skills, availability, and experience. VeridaX does not guarantee that you will be selected 
                  for any volunteer opportunity.
                </p>
                <p>
                  You acknowledge that volunteering may involve physical labor, exposure to challenging 
                  conditions, and interaction with diverse populations. You agree to volunteer at your own risk.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">6. Privacy</h2>
                <p>
                  Your use of our Platform is governed by our Privacy Policy, which is incorporated into 
                  these Terms by reference. Please review our Privacy Policy to understand how we collect, 
                  use, and disclose information about you.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">7. Intellectual Property</h2>
                <p>
                  All content on our Platform, including text, graphics, logos, images, and software, 
                  is the property of VeridaX or its licensors and is protected by copyright, trademark, 
                  and other intellectual property laws.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">8. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, VeridaX shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, or any loss of profits or 
                  revenues, whether incurred directly or indirectly.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">9. Modifications</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify you of any material 
                  changes by posting the new Terms on our Platform and updating the "Last Updated" date.
                </p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-primary-dark mb-3">10. Contact Information</h2>
                <p>
                  If you have any questions or concerns about these Terms, please contact us at:
                  <br />
                  Email: support@veridax.org
                  <br />
                  Address: 123 Main Street, City, Country
                </p>
              </section>
              
              <p className="text-sm text-gray-500 mt-8">Last Updated: April 20, 2025</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsConditions;
