import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import axios from "axios";

const StartCampaign = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate goal before processing
    if (!goal || isNaN(parseFloat(goal))) {
      toast.error("Please enter a valid goal amount");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      const ethGoal = (parseFloat(goal) / 200000).toString();
      formData.append('goal', ethGoal);
      formData.append('duration', (30 * 24 * 60 * 60).toString()); // 30 days in seconds
      if (image) {
        formData.append('image', image);
      }

      await axios.post("http://localhost:5000/api/crowdfunding/campaigns", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Campaign created successfully!");
      setTitle("");
      setCategory("");
      setGoal("");
      setDescription("");
      setImage(null);
      setImagePreview("");
    } catch (err: any) {
      toast.error("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-cream py-12">
        <div className="container max-w-4xl mx-auto px-4">
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

                  <div className="space-y-2">
                    {/* Add Image Upload Section */}
                    <div className="space-y-2">
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Campaign Image
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          {imagePreview ? (
                            <div className="relative">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="mx-auto h-32 w-auto object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setImage(null);
                                  setImagePreview("");
                                }}
                                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="image-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="image-upload"
                                    name="image-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
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
    </div>
  );
};

export default StartCampaign;
