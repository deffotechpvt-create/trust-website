const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const razorpay = require('./config/razorpay');
require('dotenv').config();
const Donation = require('./model/Donation');
const Donor = require('./model/Donor');
const { sendDonationReceipt, sendTaxCertificate, sendWelcomeEmail } = require('./services/emailService');
const app = express();
const PORT = process.env.PORT || 4242;

const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked request', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
connectDB();

// CREATE ORDER ENDPOINT - UPDATED
app.post('/api/razorpay/order', async (req, res) => {
  try {
    const {
      amount,
      currency = 'INR',
      donationType,
      purpose,
      paymentMethod,
      donorDetails  // Receive donor details
    } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Validate donor information
    if (!donorDetails || !donorDetails.name || !donorDetails.email || !donorDetails.phone) {
      return res.status(400).json({
        success: false,
        message: 'Donor name, email and phone are required'
      });
    }

    // Find or create donor
    let donor = await Donor.findOne({ email: donorDetails.email });

    if (!donor) {
      // Create new donor
      donor = await Donor.create({
        name: donorDetails.name,
        email: donorDetails.email,
        phone: donorDetails.phone,
        address: donorDetails.address || '',
        city: donorDetails.city || '',
        state: donorDetails.state || '',
        pincode: donorDetails.pincode || '',
        pan: donorDetails.pan || '',
        taxCertificatePreference: donorDetails.taxCertificateRequired || false
      });
    } else {
      // Update existing donor info
      donor.name = donorDetails.name;
      donor.phone = donorDetails.phone;
      if (donorDetails.address) donor.address = donorDetails.address;
      if (donorDetails.city) donor.city = donorDetails.city;
      if (donorDetails.state) donor.state = donorDetails.state;
      if (donorDetails.pincode) donor.pincode = donorDetails.pincode;
      if (donorDetails.pan) donor.pan = donorDetails.pan;
      if (donorDetails.taxCertificateRequired !== undefined) {
        donor.taxCertificatePreference = donorDetails.taxCertificateRequired;
      }
      await donor.save();
    }

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: currency,
      receipt: `donation_${Date.now()}`,
      payment_capture: 1,
      notes: {
        donationType: donationType || 'general',
        paymentMethod: paymentMethod || 'not_specified',
        donorEmail: donor.email,
        donorName: donor.name
      }
    };

    const order = await razorpay.orders.create(options);

    // Create donation record linked to donor
    const donation = await Donation.create({
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      donationType: donationType,
      paymentMethod: paymentMethod,
      paymentStatus: 'created',
      purpose: purpose,
      donor: donor._id,  // Link to donor
      donorSnapshot: {  // Snapshot for record keeping
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        address: donor.address,
        city: donor.city,
        state: donor.state,
        pincode: donor.pincode
      },
      taxCertificateRequired: donorDetails.taxCertificateRequired || false,
      notes: options.notes
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({
      success: false,
      message: 'Could not create order',
      error: err.message
    });
  }
});

// CREATE ANONYMOUS ORDER - Without Donor Details
app.post('/api/razorpay/anonymous/order', async (req, res) => {
  try {
    const {
      amount,
      currency = 'INR',
      donationType,
      paymentMethod,
    } = req.body;

    // Validate amount only
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    if (!Number.isInteger(amount)) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be in smallest currency unit (paise for INR)'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: currency,
      receipt: `anonymous_donation_${Date.now()}`,
      payment_capture: 1,
      notes: {
        donationType: donationType || 'one-time',
        paymentMethod: paymentMethod || 'not_specified',
        isAnonymous: 'true'
      }
    };

    const order = await razorpay.orders.create(options);

    // Create anonymous donation record (no donor reference)
    const donation = await Donation.create({
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      donationType: donationType || 'one-time',
      paymentMethod: paymentMethod,
      paymentStatus: 'created',
      donor: null,  // No donor reference
      donorSnapshot: {
        name: 'Anonymous',
        email: null,
        phone: null
      },
      notes: options.notes
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error('Anonymous order creation error:', err);
    res.status(500).json({
      success: false,
      message: 'Could not create order',
      error: err.message
    });
  }
});

// VERIFY ANONYMOUS PAYMENT
app.post('/api/razorpay/anonymous/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment parameters'
      });
    }

    // Generate signature for verification
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    // Verify signature
    if (generated_signature === razorpay_signature) {
      // Update anonymous donation record
      const donation = await Donation.findOneAndUpdate(
        { razorpay_order_id },
        {
          razorpay_payment_id,
          razorpay_signature,
          paymentStatus: 'captured',
          paidAt: new Date()
        },
        { new: true }
      );

      if (!donation) {
        return res.status(404).json({
          success: false,
          message: 'Donation record not found'
        });
      }

      // No donor stats to update for anonymous donations

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        donation: {
          id: donation._id,
          orderId: donation.razorpay_order_id,
          paymentId: donation.razorpay_payment_id,
          amount: donation.amount,
          currency: donation.currency,
          status: donation.paymentStatus,
          isAnonymous: true,
          paidAt: donation.paidAt
        }
      });

    } else {
      // Signature mismatch
      await Donation.findOneAndUpdate(
        { razorpay_order_id },
        { paymentStatus: 'failed' }
      );

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

  } catch (err) {
    console.error('Anonymous verification error:', err);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: err.message
    });
  }
});

// VERIFY PAYMENT ENDPOINT - UPDATED
app.post('/api/razorpay/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment parameters'
      });
    }

    // Generate signature
    const text = razorpay_order_id + '|' + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Update donation record
      const donation = await Donation.findOneAndUpdate(
        { razorpay_order_id },
        {
          razorpay_payment_id,
          razorpay_signature,
          paymentStatus: 'captured',
          paidAt: new Date()
        },
        { new: true }
      ).populate('donor');  // Populate donor details

      if (!donation) {
        return res.status(404).json({
          success: false,
          message: 'Donation record not found'
        });
      }

      // Update donor statistics
      await Donor.findByIdAndUpdate(donation.donor._id, {
        $inc: {
          donationCount: 1,
          totalAmount: donation.amount
        },
        lastDonationDate: new Date()
      });


      // Send receipt email
      if (donation.donor && donation.donor.email) {
        try {
          await sendDonationReceipt(donation, donation.donor);

          // Mark receipt as sent
          await Donation.findByIdAndUpdate(donation._id, {
            receiptSent: true,
            receiptSentAt: new Date()
          });

          console.log('✅ Receipt email sent successfully to:', donation.donor.email);
        } catch (emailError) {
          console.error('❌ Email sending failed:', emailError);
          // Don't fail the payment if email fails
        }
      }
      if (donation.taxCertificateRequired && donation.donor.pan) {
        try {
          const certificateNumber = `80G/${new Date().getFullYear()}/${donation._id.toString().slice(-8).toUpperCase()}`;

          await sendTaxCertificate(donation, donation.donor, certificateNumber);

          // Update donation with certificate info
          await Donation.findByIdAndUpdate(donation._id, {
            taxCertificateIssued: true,
            taxCertificateNumber: certificateNumber
          });

          console.log('✅ Tax certificate sent successfully');
        } catch (certError) {
          console.error('❌ Tax certificate sending failed:', certError);
        }
      }


      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        donation: {
          id: donation._id,
          orderId: donation.razorpay_order_id,
          paymentId: donation.razorpay_payment_id,
          amount: donation.amount,
          currency: donation.currency,
          status: donation.paymentStatus,
          donor: {
            name: donation.donor.name,
            email: donation.donor.email
          },
          paidAt: donation.paidAt
        }
      });

    } else {
      await Donation.findOneAndUpdate(
        { razorpay_order_id },
        { paymentStatus: 'failed' }
      );

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Razorpay server listening on port ${PORT}`);
});