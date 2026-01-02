import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useSEO } from "@/lib/seo";

const PaymentSuccess = () => {
  useSEO({ title: 'Payment Successful', description: 'Your payment to Arul Trust was successful.' });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
      <Card className="w-full max-w-md text-center p-8 shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-green-100 rounded-full h-20 w-20 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mt-6">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Thank you for your payment. Your transaction has been completed successfully. A confirmation has been sent to your email address.
          </p>
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
            <Link to="/">
              Return to Homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
