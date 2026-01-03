import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface TransactionDetailsProps {
  transaction: any;
  onClose: () => void;
}

export const TransactionDetails = ({ transaction, onClose }: TransactionDetailsProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-600">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-600">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="mt-6 p-6 border rounded-lg bg-muted/30">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Transaction Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Order ID</p>
          <p className="font-mono font-semibold">{transaction.orderId}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Payment ID</p>
          <p className="font-mono font-semibold">{transaction.paymentId}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Donor Name</p>
          <p className="font-semibold">{transaction.donorName}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p className="font-semibold">{transaction.email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Phone</p>
          <p className="font-semibold">{transaction.phone}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Amount</p>
          <p className="font-semibold text-primary">₹{transaction.amount}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Status</p>
          {getStatusBadge(transaction.status)}
        </div>
        <div>
          <p className="text-muted-foreground">Certificate Issued</p>
          <p className="font-semibold">
            {transaction.certificateIssued ? (
              <CheckCircle className="w-5 h-5 text-green-600 inline mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600 inline mr-2" />
            )}
            {transaction.certificateIssued ? "Yes" : "No"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button className="gap-2" size="sm">
          <Mail className="w-4 h-4" />
          Send Receipt
        </Button>
        {transaction.status === "verified" && !transaction.certificateIssued && (
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="w-4 h-4" />
            Generate Certificate
          </Button>
        )}
      </div>
    </div>
  );
};
