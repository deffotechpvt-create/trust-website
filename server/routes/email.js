const express = require('express');
const router = express.Router();
const Donation = require('../model/Donation');
const { verifyAdmin } = require('../middleware/auth');
const { sendDonationReceipt, sendTaxCertificate } = require('../services/emailService');

// All routes are protected - Admin only
router.use(verifyAdmin);

// Send Receipt
router.post('/send-receipt/:donationId', async (req, res) => {
  try {
    const { donationId } = req.params;

    // Find donation and populate donor
    const donation = await Donation.findById(donationId).populate('donor');
    
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }

    // Verify payment is captured
    if (donation.paymentStatus !== 'captured') {
      return res.status(400).json({ 
        success: false, 
        message: 'Receipt can only be sent for successful payments' 
      });
    }

    // Check if donor exists
    if (!donation.donor) {
      return res.status(400).json({ 
        success: false, 
        message: 'Donor information not found' 
      });
    }

    // Send receipt email using existing function
    await sendDonationReceipt(donation, donation.donor);

    // Update donation record
    donation.receiptSent = true;
    donation.receiptSentAt = new Date();
    await donation.save();

    res.json({
      success: true,
      message: `Receipt sent successfully to ${donation.donor.email}`,
      data: {
        orderId: donation.razorpay_order_id,
        email: donation.donor.email,
        sentAt: donation.receiptSentAt
      }
    });

  } catch (error) {
    console.error('Send receipt error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send receipt email' 
    });
  }
});

// Send Tax Certificate
router.post('/send-certificate/:donationId', async (req, res) => {
  try {
    const { donationId } = req.params;

    // Find donation and populate donor
    const donation = await Donation.findById(donationId).populate('donor');
    
    if (!donation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donation not found' 
      });
    }

    // Verify payment is captured
    if (donation.paymentStatus !== 'captured') {
      return res.status(400).json({ 
        success: false, 
        message: 'Certificate can only be issued for successful payments' 
      });
    }

    // Check if donor exists
    if (!donation.donor) {
      return res.status(400).json({ 
        success: false, 
        message: 'Donor information not found' 
      });
    }

    // Use existing certificate number if already issued, otherwise generate new one
    let certNumber;
    let isResend = false;

    if (donation.taxCertificateIssued && donation.taxCertificateNumber) {
      // Resend with existing certificate number
      certNumber = donation.taxCertificateNumber;
      isResend = true;
    } else {
      // Generate new certificate number (Format: 80G/YEAR/DONATION_ID_LAST_8)
      const year = new Date().getFullYear();
      certNumber = `80G/${year}/${donation._id.toString().slice(-8).toUpperCase()}`;
    }

    // Send tax certificate email using existing function
    await sendTaxCertificate(donation, donation.donor, certNumber);

    // Update donation record (only update issuedAt if first time)
    donation.taxCertificateIssued = true;
    donation.taxCertificateNumber = certNumber;
    if (!donation.taxCertificateIssuedAt) {
      donation.taxCertificateIssuedAt = new Date();
    }
    await donation.save();

    res.json({
      success: true,
      message: `Tax certificate ${isResend ? 'resent' : 'sent'} successfully to ${donation.donor.email}`,
      data: {
        certificateNumber: certNumber,
        orderId: donation.razorpay_order_id,
        email: donation.donor.email,
        issuedAt: donation.taxCertificateIssuedAt,
        isResend: isResend
      }
    });

  } catch (error) {
    console.error('Send certificate error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send tax certificate' 
    });
  }
});

module.exports = router;