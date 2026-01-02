import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, Building2 } from "lucide-react";
import { useSEO } from "@/lib/seo";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  useSEO({ title: 'Make a Payment', description: 'Make a payment to Arul Trust for various services.', image: '/assets/hero-education.jpg' });
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const existing = document.querySelector(`script[src="https://checkout.razorpay.com/v1/checkout.js"]`);
      if (existing) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      if (!amount || amount === "0") {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid payment amount.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }
      if (!purpose) {
        toast({
          title: "Invalid Purpose",
          description: "Please specify the purpose of the payment.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }
      if(!name || !email || !phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in your name, email, and phone number.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }

      const amountNumber = Math.max(1, Number(amount));
      const amountPaise = Math.round(amountNumber * 100);

      const resp = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt: `payment_${Date.now()}` })
      });

      if (!resp.ok) {
        const err = await resp.text();
        toast({ title: 'Payment Error', description: err || 'Failed to create payment order', variant: 'destructive' });
        setProcessing(false);
        return;
      }

      const { orderId, amount: orderAmount, currency, keyId } = await resp.json();

      const ok = await loadRazorpayScript();
      if (!ok) {
        toast({ title: 'Payment Error', description: 'Failed to load Razorpay SDK', variant: 'destructive' });
        setProcessing(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderAmount,
        currency: currency || 'INR',
        name: 'Arul Trust',
        description: `Payment for ${purpose}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verify = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            if (!verify.ok) {
              const text = await verify.text();
              toast({ title: 'Verification Failed', description: text || 'Payment could not be verified', variant: 'destructive' });
            } else {
              toast({ title: 'Thank You!', description: `Your payment of ₹${amountNumber} was successful.` });
              navigate("/payment-success");
            }
          } catch (err) {
            toast({ title: 'Verification Error', description: 'Could not verify payment. We will contact you if needed.', variant: 'destructive' });
          }
        },
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        theme: { color: '#2563eb' }
      } as any;

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment flow error', error);
      toast({ title: 'Payment Error', description: 'Something went wrong while processing the payment', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Make a Payment
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Use this page to make payments for various services offered by Arul Trust.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Payment Details</CardTitle>
              <CardDescription className="text-center">
                Enter the details for your payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="purpose">Purpose of Payment *</Label>
                <Input id="purpose" placeholder="e.g., Event Fee, Course Material" required value={purpose} onChange={(e) => setPurpose(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input id="amount" type="number" placeholder="Enter amount in ₹" required value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" placeholder="Enter your full name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="Enter your phone number" required value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label className="text-base font-medium">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Credit/Debit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="upi">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        UPI Payment
                      </div>
                    </SelectItem>
                    <SelectItem value="netbanking">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Net Banking
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button size="lg" className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3" onClick={handlePayment} disabled={processing}>
                {processing ? "Processing..." : <><CreditCard className="mr-2 h-5 w-5" /> Proceed to Pay</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
