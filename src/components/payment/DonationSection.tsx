import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, CreditCard, Smartphone, Building2, Gift, Shield, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../lib/api'
const DonationSection = () => {
  const [donationAmount, setDonationAmount] = useState("1000");
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState("one-time");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const { post } = useApi();

  const predefinedAmounts = [
    { value: "500", label: "₹500", impact: "Supports 1 student's books for a month" },
    { value: "1000", label: "₹1,000", impact: "Provides digital access for 5 students" },
    { value: "2500", label: "₹2,500", impact: "Sponsors a week of teacher training" },
    { value: "5000", label: "₹5,000", impact: "Funds a scholarship for a month" },
    { value: "10000", label: "₹10,000", impact: "Establishes a mini digital library" },
    { value: "custom", label: "Custom Amount", impact: "Every rupee makes a difference" }
  ];

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

  const handleDonate = async () => {
    try {
      setProcessing(true);
      const amountStr = donationAmount === "custom" ? customAmount : donationAmount;
      if (!amountStr || amountStr === "0") {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid donation amount.",
          variant: "destructive"
        });
        setProcessing(false);
        return;
      }
      if (!acceptedTerms) {
        toast({ title: 'Consent Required', description: 'Please accept terms and privacy policy to proceed.', variant: 'destructive' });
        setProcessing(false);
        return;
      }
      const amountNumber = Math.max(1, Number(amountStr));
      const amountPaise = Math.round(amountNumber * 100); // Razorpay expects amount in paise

      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        toast({
          title: 'Payment SDK Unavailable',
          description: 'Could not load payment gateway. Please try again.',
          variant: 'destructive'
        });
        setProcessing(false);
        return;
      }


      const response =await post('/razorpay/anonymous/order', { 
        amount: amountPaise,
        currency: 'INR',
        donationType,
        paymentMethod
      });
      // Extract data from Axios response
      const orderData = response.data;

      if (!orderData || !orderData.success) {
        toast({
          title: 'Payment Error',
          description: orderData?.message || 'Failed to create payment order',
          variant: 'destructive'
        });
        setProcessing(false);
        return;
      }

      const { orderId, amount: orderAmount, currency, keyId } = orderData;

      const options = {
        key: keyId,
        amount: orderAmount,
        currency: currency || 'INR',
        name: 'Arul Trust',
        description: 'Donation',
        order_id: orderId,
        handler: async (response: any) => {
          // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          try {
            // Verify payment using useApi hook
            const verifyResponse = await  post('/razorpay/anonymous/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            const verifyData = verifyResponse.data;
            if (!verifyData || !verifyData.success) {
              toast({
                title: 'Verification Failed',
                description: verifyData?.message || 'Payment could not be verified',
                variant: 'destructive'
              });
              setProcessing(false);
              return;
            }

            toast({
              title: 'Thank You!',
              description: `Your donation of ₹${amountNumber} was successful.`
            });

            // Navigate to success page
            navigate("/payment-success", {
              state: {
                amount: amountNumber,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                donationType: donationType
              }
            });
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            toast({
              title: 'Verification Error',
              description: 'Could not verify payment. Please contact support.',
              variant: 'destructive'
            });
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment process.',
              variant: 'default'
            });
            setProcessing(false);
          }
        },
        prefill: {
          name: undefined,
          email: undefined
        },
        notes: {
          donationType: donationType,
          paymentMethod: paymentMethod
        },
        theme: { color: '#2563eb' }
      } as any;

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        toast({
          title: 'Payment Failed',
          description: response.error.description || 'Payment was not successful. Please try again.',
          variant: 'destructive'
        });
        setProcessing(false);
      });

      rzp.open();
    } catch (error) {
      console.error('Donation flow error', error);
      toast({ title: 'Donation Error', description: 'Redirecting to payment page to continue.', variant: 'destructive' });
      navigate('/payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
            Make a Difference Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your contribution directly impacts students' lives, providing them with the tools and opportunities
            they need to succeed in their educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card className="card-shadow border-0">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-secondary" />
                  Secure Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Donation Type */}
                <div>
                  <Label className="text-base font-semibold text-primary mb-4 block">
                    Donation Type
                  </Label>
                  <RadioGroup value={donationType} onValueChange={setDonationType} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <Label htmlFor="one-time" className="cursor-pointer">One-time Donation</Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="cursor-pointer">Monthly Donation</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Amount Selection */}
                <div>
                  <Label className="text-base font-semibold text-primary mb-4 block">
                    Select Amount
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        onClick={() => setDonationAmount(amount.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${donationAmount === amount.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 hover:border-primary/50 text-gray-700"
                          }`}
                      >
                        <div className="font-bold text-lg">{amount.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{amount.impact}</div>
                      </button>
                    ))}
                  </div>

                  {donationAmount === "custom" && (
                    <div>
                      <Label htmlFor="custom-amount" className="text-sm font-medium">Custom Amount (₹)</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="mt-2"
                        min="1"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div>
                  <Label className="text-base font-semibold text-primary mb-4 block">
                    Payment Method
                  </Label>
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

                {/* Donate Button */}
                <Button
                  onClick={handleDonate}
                  variant="donate"
                  size="xl"
                  className="w-full text-lg"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Donate {donationAmount === "custom" ? customAmount ? `₹${customAmount}` : "" : `₹${donationAmount}`}
                  {donationType === "monthly" && " Monthly"}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  Secured by 256-bit SSL encryption
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Terms Acceptance */}
          <div className="lg:col-span-2 mt-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="donation-terms" checked={acceptedTerms} onCheckedChange={(v) => setAcceptedTerms(Boolean(v))} />
              <Label htmlFor="donation-terms" className="text-sm">I agree to the <a href="/terms" className="text-primary underline">terms</a> and <a href="/privacy" className="text-primary underline">privacy policy</a></Label>
            </div>
          </div>

          {/* Impact & Info Sidebar */}
          <div className="space-y-6">
            {/* Tax Benefits */}
            <Card className="card-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold text-primary">Tax Benefits</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get 80G tax deduction on your donations. You'll receive a tax-exemption certificate via email.
                </p>
                <div className="text-xs text-muted-foreground">
                  Registration: 12345678901234567890
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="card-shadow border-0">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-trust-gold" />
                  <h3 className="font-bold text-primary">Trusted Platform</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-trust-green rounded-full"></div>
                    <span>100% Transparent Usage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-trust-green rounded-full"></div>
                    <span>Direct Impact Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-trust-green rounded-full"></div>
                    <span>Regular Impact Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-trust-green rounded-full"></div>
                    <span>ISO 27001 Certified</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Donor */}
            <Card className="card-shadow border-0">
              <CardContent className="p-6">
                <h3 className="font-bold text-primary mb-4">Recent Supporter</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-medium">Anonymous Donor</div>
                    <div className="text-sm text-muted-foreground">Donated ₹5,000</div>
                    <div className="text-xs text-muted-foreground">2 hours ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;