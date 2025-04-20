
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { makeDonation } from "@/services/api";

const DonationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    amount: "500",
    customAmount: "",
    paymentMethod: "upi",
    upiId: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    message: "",
    isAnonymous: false,
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This would typically come from an API request based on the campaign ID
  const campaignDetails = {
    title: "Medical Treatment for Ravi",
    category: "Medical",
    description: "Help 8-year-old Ravi get the critical heart surgery he needs to live a normal life.",
    raised: 350000,
    goal: 500000,
    daysLeft: 15,
    supporters: 128,
    image: "/placeholder.svg?height=200&width=300",
    urgent: true,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAmountChange = (value: string) => {
    setFormData({
      ...formData,
      amount: value,
      customAmount: "",
    });
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      amount: "custom",
      customAmount: value,
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({
      ...formData,
      paymentMethod: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Prepare donation data
      const donationData = {
        campaignId: id,
        fullName: formData.fullName,
        email: formData.email,
        finalAmount: formData.amount === "custom" ? formData.customAmount : formData.amount,
        paymentMethod: formData.paymentMethod,
        message: formData.message,
        isAnonymous: formData.isAnonymous,
      };
      
      // In a development environment without a backend, simulate API call
      if (process.env.NODE_ENV !== 'production') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Donation Data:', donationData);
        toast.success("Donation successful! Thank you for your generosity.");
        navigate("/crowdfunding/thank-you");
        return;
      }
      
      // If backend is available, make the actual API call
      await makeDonation(donationData);
      toast.success("Donation successful! Thank you for your generosity.");
      navigate("/crowdfunding/thank-you");
    } catch (error) {
      console.error("Error processing donation:", error);
      toast.error("Donation failed. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-cream py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-primary-dark">Campaign Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-48 rounded-md overflow-hidden">
                    <img
                      src={campaignDetails.image}
                      alt={campaignDetails.title}
                      className="object-cover w-full h-full"
                    />
                    {campaignDetails.urgent && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Urgent
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-primary-dark">{campaignDetails.title}</h3>
                  <p className="text-sm text-gray-600">{campaignDetails.description}</p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-secondary h-2.5 rounded-full"
                      style={{ width: `${Math.min(100, (campaignDetails.raised / campaignDetails.goal) * 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">₹{campaignDetails.raised.toLocaleString()}</span>
                    <span className="text-gray-600">of ₹{campaignDetails.goal.toLocaleString()}</span>
                  </div>
                  
                  <div className="text-sm flex justify-between pt-2">
                    <span>{campaignDetails.supporters} supporters</span>
                    <span>{campaignDetails.daysLeft} days left</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary-dark">Make a Donation</CardTitle>
                  <CardDescription>
                    Your contribution will help make a difference.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Donation Amount</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {["100", "500", "1000", "5000"].map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={formData.amount === amount ? "default" : "outline"}
                            onClick={() => handleAmountChange(amount)}
                            className={formData.amount === amount ? "bg-primary" : ""}
                          >
                            ₹{parseInt(amount).toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      
                      {/* Fixed: Added RadioGroup around the custom amount RadioGroupItem */}
                      <RadioGroup className="mt-3" value={formData.amount} onValueChange={handleAmountChange}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            id="customAmount"
                            value="custom"
                          />
                          <Label htmlFor="customAmount" className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span>Custom Amount: ₹</span>
                              <Input
                                type="number"
                                min="1"
                                placeholder="Enter amount"
                                value={formData.customAmount}
                                onChange={handleCustomAmountChange}
                                className="max-w-[150px]"
                                onClick={() => handleAmountChange("custom")}
                              />
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={handlePaymentMethodChange}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="upi" value="upi" />
                          <Label htmlFor="upi">UPI</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="card" value="card" />
                          <Label htmlFor="card">Credit/Debit Card</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {formData.paymentMethod === "upi" && (
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          name="upiId"
                          placeholder="yourname@bank"
                          value={formData.upiId}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    )}
                    
                    {formData.paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Expiry Date</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/YY"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="cardCvv">CVV</Label>
                            <Input
                              id="cardCvv"
                              name="cardCvv"
                              type="password"
                              placeholder="123"
                              value={formData.cardCvv}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Leave a message of support"
                        value={formData.message}
                        onChange={handleChange}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isAnonymous"
                        checked={formData.isAnonymous}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("isAnonymous", checked as boolean)
                        }
                      />
                      <label
                        htmlFor="isAnonymous"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Make my donation anonymous
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("agreeToTerms", checked as boolean)
                        }
                        required
                      />
                      <label
                        htmlFor="agreeToTerms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the terms and conditions
                      </label>
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Complete Donation"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default DonationForm;
