import React, { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeNewsletter } from "@/services/api";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await subscribeNewsletter(email);
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-primary text-cream">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">VeridaX</h3>
            <p className="text-cream/80">
              Connecting generous hearts with meaningful causes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-cream/80 hover:text-cream transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/crowdfunding" className="text-cream/80 hover:text-cream transition-colors">
                  Crowdfunding
                </Link>
              </li>
              <li>
                <Link to="/volunteer" className="text-cream/80 hover:text-cream transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream/80 hover:text-cream transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact</h3>
            <ul className="space-y-2">
              <li className="text-cream/80">support@veridax.com</li>
              <li className="text-cream/80">+91 1234567890</li>
              <li className="text-cream/80">Pune, India</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Newsletter</h3>
            <p className="text-cream/80">Subscribe to get updates on new campaigns and opportunities.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 rounded text-primary-dark focus:outline-none"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary text-primary-dark px-4 py-2 rounded font-medium hover:bg-secondary-dark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-cream/20 mt-12 pt-8 text-center text-cream/70">
          <p>© VeridaX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
