import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Shield, CreditCard, Users, Smartphone, Building2 } from "lucide-react";
import { useSEO } from "@/lib/seo";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Donate = () => {
  useSEO({ title: 'Donate', description: 'Support ArulEducation Trust with a donation to help students and programs.', image: '/assets/hero-education.jpg' });
  const [donationType, setDonationType] = useState("one-time");
  const [amount, setAmount] = useState("1000");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const predefinedAmounts = ["500", "1000", "2500", "5000", "10000"];

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
      const amountStr = customAmount || amount;
      if (!amountStr || amountStr === "0") {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid donation amount.",
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

      const amountNumber = Math.max(1, Number(amountStr));
      const amountPaise = Math.round(amountNumber * 100); // Razorpay expects amount in paise

      // 1) Create order on our backend
      const resp = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountPaise, currency: 'INR', donationType, paymentMethod })
      });

      if (!resp.ok) {
        // If backend missing (404) or temporarily unavailable, fall back to the manual Payment page
        if (resp.status === 404) {
          toast({ title: 'Backend Unavailable', description: 'Redirecting to payment page to continue.', variant: 'default' });
          navigate('/payment');
          setProcessing(false);
          return;
        }
        const err = await resp.text();
        toast({ title: 'Payment Error', description: err || 'Failed to create payment order', variant: 'destructive' });
        setProcessing(false);
        return;
      }

      const { orderId, amount: orderAmount, currency, keyId } = await resp.json();

      const ok = await loadRazorpayScript();
      if (!ok) {
        // SDK failed to load; redirect user to manual Payment page as a fallback
        toast({ title: 'Payment SDK Unavailable', description: 'Redirecting to payment page to continue.', variant: 'default' });
        navigate('/payment');
        setProcessing(false);
        return;
      }

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
            const verify = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            if (!verify.ok) {
              const text = await verify.text();
              toast({ title: 'Verification Failed', description: text || 'Payment could not be verified', variant: 'destructive' });
            } else {
              toast({ title: 'Thank You!', description: `Your donation of ₹${amountNumber} was successful.` });
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
      console.error('Donation flow error', error);
      // On network/backend errors, redirect to manual payment page so user can continue
      toast({ title: 'Donation Error', description: 'Redirecting to payment page to continue.', variant: 'destructive' });
      navigate('/payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Make a Difference Today
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your donation helps us provide quality education and transform lives. Every contribution counts.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary">10,000+</h3>
              <p className="text-muted-foreground">Students Supported</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-secondary">500+</h3>
              <p className="text-muted-foreground">Schools Partnered</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-accent">15+</h3>
              <p className="text-muted-foreground">Years of Impact</p>
            </CardContent>
          </Card>
        </div>

        {/* Donation Form */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Donation Details</CardTitle>
              <CardDescription className="text-center">
                Choose your donation type and amount
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={donationType} onValueChange={setDonationType} className="mb-8">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="one-time">One-time Donation</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Donation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="one-time" className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Select Amount (₹)</Label>
                    <RadioGroup value={amount} onValueChange={(value) => { setAmount(value); setCustomAmount(""); }} className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {predefinedAmounts.map((amt) => (
                        <div key={amt} className="flex items-center space-x-2">
                          <RadioGroupItem value={amt} id={amt} className="sr-only" />
                          <Label
                            htmlFor={amt}
                            className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all hover:border-primary ${
                              amount === amt && !customAmount ? "border-primary bg-primary/10" : "border-border"
                            }`}
                          >
                            ₹{amt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <div className="mt-4">
                      <Label htmlFor="custom-amount">Or enter custom amount</Label>
                      <Input
                        id="custom-amount"
                        placeholder="Enter amount in ₹"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount("");
                        }}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="monthly" className="space-y-6">
                  <div>
                    <Label className="text-base font-medium mb-4 block">Monthly Amount (₹)</Label>
                    <RadioGroup value={amount} onValueChange={setAmount} className="grid grid-cols-3 md:grid-cols-5 gap-4">
                      {["200", "500", "1000", "2000", "5000"].map((amt) => (
                        <div key={amt} className="flex items-center space-x-2">
                          <RadioGroupItem value={amt} id={`monthly-${amt}`} className="sr-only" />
                          <Label
                            htmlFor={`monthly-${amt}`}
                            className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all hover:border-primary ${
                              amount === amt ? "border-primary bg-primary/10" : "border-border"
                            }`}
                          >
                            ₹{amt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Purpose Selection */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Purpose of Donation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">General Education Support</SelectItem>
                    <SelectItem value="infrastructure">Infrastructure Development</SelectItem>
                    <SelectItem value="scholarships">Scholarships for Students</SelectItem>
                    <SelectItem value="technology">Technology & Digital Learning</SelectItem>
                    <SelectItem value="teacher-training">Teacher Training Programs</SelectItem>
                    <SelectItem value="emergency">Emergency Relief Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

               {/* Payment Method */}
               <div className="space-y-4 mt-8">
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

              {/* Donor Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
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
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Address Details</h3>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" placeholder="Enter your address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input id="pincode" placeholder="Pincode" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="west-bengal">West Bengal</SelectItem>
                        <SelectItem value="bihar">Bihar</SelectItem>
                        <SelectItem value="odisha">Odisha</SelectItem>
                        <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Tax Exemption */}
              <div className="mt-8 p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox id="tax-exemption" />
                  <Label htmlFor="tax-exemption" className="text-sm">
                    I would like to receive 80G tax exemption certificate
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Under Section 80G of the Income Tax Act, you can claim deduction for donations made to registered charitable organizations.
                </p>
              </div>

              {/* Terms and Conditions */}
              <div className="mt-6 flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and privacy policy *
                </Label>
              </div>

              {/* Payment Button */}
              <div className="mt-8 text-center">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3" onClick={handleDonate} disabled={processing}>
                  {processing ? "Processing..." : <><CreditCard className="mr-2 h-5 w-5" /> Proceed to Payment</>}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Secure payment powered by trusted payment gateways
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Info */}
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center space-x-2 text-muted-foreground">
            <Shield className="h-5 w-5" />
            <span className="text-sm">Your donation is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;