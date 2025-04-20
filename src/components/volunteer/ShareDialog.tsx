
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shareOpportunity } from "@/services/api";
import { toast } from "sonner";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  opportunityId: string;
  opportunityTitle: string;
}

const ShareDialog = ({ isOpen, onClose, opportunityId, opportunityTitle }: ShareDialogProps) => {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !senderName) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await shareOpportunity(opportunityId, recipientEmail, senderName);
      toast.success("Opportunity shared successfully!");
      onClose();
      setRecipientEmail("");
      setSenderName("");
    } catch (error) {
      toast.error("Failed to share opportunity. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Volunteer Opportunity</DialogTitle>
          <DialogDescription>
            Share this opportunity with someone who might be interested
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleShare} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">Recipient's Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient's email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senderName">Your Name</Label>
            <Input
              id="senderName"
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Sharing..." : "Share Opportunity"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
