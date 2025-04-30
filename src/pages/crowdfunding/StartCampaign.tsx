import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

const StartCampaign = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert INR to ETH (adjust the rate as needed)
      const ethGoal = (parseFloat(goal) / 200000).toString();
      const duration = 30 * 24 * 60 * 60; // 30 days in seconds

      await axios.post("http://localhost:5000/api/crowdfunding/campaigns", {
        title,
        description,
        goal: ethGoal,
        duration,
      });
      toast.success("Campaign created on blockchain successfully!");
      setTitle("");
      setCategory("");
      setGoal("");
      setDescription("");
    } catch (err: any) {
      toast.error("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 bg-cream py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary-dark mb-4">Start a Campaign</h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Create a campaign to raise funds for a meaningful cause. All campaigns are verified to ensure credibility.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="bg-white shadow-sm">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Give your campaign a clear, descriptive title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Medical">Medical</option>
                      <option value="Education">Education</option>
                      <option value="Environment">Environment</option>
                      <option value="Disaster Relief">Disaster Relief</option>
                      <option value="Arts & Culture">Arts & Culture</option>
                      <option value="Sports">Sports</option>
                      <option value="Animal Welfare">Animal Welfare</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                      Fundraising Goal (₹)
                    </label>
                    <input
                      type="number"
                      id="goal"
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter amount in Rupees"
                      min="1000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Campaign Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={5}
                      className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Describe your campaign in detail. Be specific about how the funds will be used."
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" asChild>
                      <Link to="/crowdfunding">Cancel</Link>
                    </Button>
                    <Button type="submit" className="bg-primary text-cream hover:bg-primary-dark" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Campaign"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold text-primary-dark mb-4">What happens after you submit?</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Our team will review your campaign within 48 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>You may be asked to provide verification documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="bg-primary text-cream rounded-full p-1 mt-0.5">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>Once approved, your campaign will be live and you'll receive a notification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StartCampaign;
