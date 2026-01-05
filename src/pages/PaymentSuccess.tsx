import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Home, Mail, Share2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const paymentData = location.state || {};

  const {
    amount = 0,
    orderId = 'N/A',
    paymentId = 'N/A',
    donationType = 'one-time',
    isAnonymous = false,
  } = paymentData;

  useEffect(() => {
    // Confetti effect on mount (optional)
  }, []);

  // Download Receipt as PDF
  const handleDownloadReceipt = () => {
    try {
      const doc = new jsPDF();

      // Add Trust Logo/Header
      doc.setFillColor(102, 126, 234);
      doc.rect(0, 0, 210, 40, 'F');

      // Trust Name
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('ARUL TRUST', 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      doc.text('Donation Receipt', 105, 30, { align: 'center' });

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Receipt Title
      doc.setFontSize(18);
      doc.setFont(undefined, 'bold');
      doc.text('PAYMENT RECEIPT', 105, 55, { align: 'center' });

      // Success checkmark - Draw using lines with rounded caps
      doc.setFillColor(34, 197, 94);
      doc.circle(105, 70, 8, 'F');

      // Draw checkmark manually with rounded caps
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(2);
      doc.setLineCap('round');  // Add this to round the line ends
      doc.setLineJoin('round'); // Add this to round the line joins

      // Short line (bottom left to middle)
      doc.line(101, 70, 103.5, 72.5);
      // Long line (middle to top right)
      doc.line(103.5, 72.5, 109, 67);




      // Amount Box
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(240, 240, 255);
      doc.roundedRect(40, 85, 130, 25, 3, 3, 'F');

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text('Donation Amount', 105, 95, { align: 'center' });

      doc.setFontSize(22);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(102, 126, 234);
      // FIX: Remove toLocaleString to avoid formatting issues in PDF
      doc.text(`${amount}`, 105, 106, { align: 'center' });

      // Transaction Details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Transaction Details', 20, 125);

      // Draw a line under heading
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(20, 127, 190, 127);

      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);

      // FIX: Use proper formatting without extra spaces
      const formattedAmount = `${amount}`;
      const formattedDate = new Date().toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const details = [
        ['Receipt Number:', orderId],
        ['Payment ID:', paymentId],
        ['Amount:', formattedAmount],
        ['Donation Type:', donationType === 'monthly' ? 'Monthly Donation' : 'One-time Donation'],
        ['Date & Time:', formattedDate],
        ['Status:', 'Completed']
      ];

      let yPos = 137;
      details.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.setTextColor(80, 80, 80);
        doc.text(label, 25, yPos);

        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        // FIX: Ensure value is a string without extra formatting
        doc.text(String(value), 80, yPos);
        yPos += 10;
      });

      // Impact Message Box
      yPos += 5;
      // doc.setFillColor(255, 243, 205);
      // doc.setDrawColor(255, 193, 7);
      doc.setLineWidth(0.5);
      // doc.roundedRect(20, yPos, 170, 35, 3, 3, 'FD');

      doc.setFontSize(11);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Your Impact:', 25, yPos + 10);

      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);
      // FIX: Use plain amount without extra formatting
      const impactText = `Your generous donation of ${amount} will help provide educational resources, support underprivileged students, and create lasting positive change in our community. Thank you for being a part of our mission!`;
      const splitText = doc.splitTextToSize(impactText, 160);
      doc.text(splitText, 25, yPos + 18);

      // Footer
      yPos = 270;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'bold');
      doc.text('Arul Education Trust', 105, yPos, { align: 'center' });

      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.text('123 Trust Street, City, State - 123456', 105, yPos + 5, { align: 'center' });
      doc.text('Email: info@arultrust.org | Phone: +91 123 456 7890', 105, yPos + 10, { align: 'center' });
      doc.text('Registration No: 12345678901234567890', 105, yPos + 15, { align: 'center' });
      doc.text(`Generated on ${new Date().toLocaleDateString('en-IN')}`, 105, yPos + 20, { align: 'center' });

      // Save PDF
      doc.save(`Receipt_${orderId}.pdf`);

      toast({
        title: "Receipt Downloaded",
        description: "Your receipt has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "Could not generate receipt. Please try again.",
        variant: "destructive"
      });
    }
  };


  // Social Media Direct Sharing
  const shareToSocialMedia = (platform: string) => {
    const text = encodeURIComponent(`I just donated ₹${amount.toLocaleString('en-IN')} to Arul Trust! Join me in supporting education.`);
    const url = encodeURIComponent(window.location.origin);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`
    };

    window.open(shareUrls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <CheckCircle2 className="relative w-24 h-24 text-green-500" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Thank you for your generous donation
              </p>
              <p className="text-sm text-gray-500">
                Your contribution makes a real difference
              </p>
            </motion.div>

            {/* Amount Display */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-6 mb-8"
            >
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Donation Amount</p>
                <p className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  ₹{amount.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-gray-600">
                  {donationType === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}
                </p>
              </div>
            </motion.div>

            {/* Transaction Details */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 mb-8 bg-gray-50 rounded-xl p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Transaction Details</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-gray-900 font-mono text-xs">{orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium text-gray-900 font-mono text-xs">{paymentId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              </div>
            </motion.div>

            {/* Impact Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-lg p-6 mb-8"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Your Impact</h4>
              <p className="text-sm text-gray-700">
                Your generous donation of ₹{amount.toLocaleString('en-IN')} will help provide
                educational resources, support underprivileged students, and create lasting
                positive change in our community. Thank you for being a part of our mission!
              </p>
            </motion.div>

            {/* Email Confirmation Notice */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-3 bg-blue-50 rounded-lg p-4 mb-8"
            >
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-gray-900 font-medium mb-1">Receipt on its way!</p>
                <p className="text-gray-600">
                  {isAnonymous
                    ? "Your donation receipt is available for download below."
                    : "A receipt and tax exemption certificate (80G) has been sent to your email."}
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            >
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>

            {/* Social Share Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="flex justify-center gap-3 mb-6"
            >
              <button
                onClick={() => shareToSocialMedia('whatsapp')}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                title="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocialMedia('twitter')}
                className="p-2 bg-black hover:bg-gray-800 text-white rounded-full transition-colors"
                title="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocialMedia('facebook')}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                title="Share on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                onClick={() => shareToSocialMedia('linkedin')}
                className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full transition-colors"
                title="Share on LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
            </motion.div>

            {/* Support Contact */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center mt-8 pt-6 border-t"
            >
              <p className="text-sm text-gray-600">
                Need help? Contact us at{' '}
                <a href="mailto:support@arultrust.org" className="text-primary hover:underline">
                  info@aruleducation.in
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;