import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Download } from "lucide-react";

interface DonorProfileProps {
  donor: any;
  onClose: () => void;
}

export const DonorProfile = ({ donor, onClose }: DonorProfileProps) => {
  return (
    <div className="mt-6 p-6 border rounded-lg bg-muted/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Donor Profile</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Name</p>
          <p className="font-semibold">{donor.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-semibold">{donor.email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Phone</p>
          <p className="font-semibold">{donor.phone}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Status</p>
          <Badge className="bg-green-600 capitalize">{donor.status}</Badge>
        </div>
        <div>
          <p className="text-muted-foreground">Total Contributions</p>
          <p className="text-2xl font-bold text-secondary">₹{donor.totalDonations.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Donation Count</p>
          <p className="text-2xl font-bold text-primary">{donor.donationCount}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button className="gap-2" size="sm">
          <Mail className="w-4 h-4" />
          Send Email
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </div>
    </div>
  );
};
