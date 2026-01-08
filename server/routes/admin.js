const express = require('express');
const router = express.Router();
const Donation = require('../model/Donation');
const Donor = require('../model/Donor');
const { verifyAdmin } = require('../middleware/auth');

// All routes are protected
router.use(verifyAdmin);

// Dashboard Statistics
router.get('/stats', async (req, res) => {
  try {
    // Total Revenue (convert paise to rupees)
    const totalRevenue = await Donation.aggregate([
      { $match: { paymentStatus: 'captured' } },
      {
        $group: {
          _id: null,
          total: { $sum: { $divide: ['$amount', 100] } } // Convert paise to rupees
        }
      }
    ]);

    const totalTransactions = await Donation.countDocuments();
    const verifiedTransactions = await Donation.countDocuments({ paymentStatus: 'captured' });
    const totalDonors = await Donor.countDocuments();
    const pendingCertificates = await Donation.countDocuments({
      paymentStatus: 'captured',
      taxCertificateIssued: { $ne: true }
    });


    // Today's revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const dailyRevenue = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'captured',
          paidAt: {
            $gte: todayStart,
            $lte: todayEnd
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $divide: ['$amount', 100] } } // Convert paise to rupees
        }
      }
    ]);

    // This month's revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthlyRevenue = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'captured',
          paidAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $divide: ['$amount', 100] } } // Convert paise to rupees
        }
      }
    ]);

    // Year to date revenue
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const ytdRevenue = await Donation.aggregate([
      {
        $match: {
          paymentStatus: 'captured',
          paidAt: {
            $gte: startOfYear,
            $lte: now
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $divide: ['$amount', 100] } } // Convert paise to rupees
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalTransactions,
        verifiedTransactions,
        totalDonors,
        pendingCertificates,
        dailyRevenue: dailyRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        ytdRevenue: ytdRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
  }
});


router.get('/transactions', async (req, res) => {
  try {
    const { status = 'all', search = '', page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    // Status filter
    if (status !== 'all') {
      if (status === 'verified') {
        query.paymentStatus = 'captured';
      } else if (status === 'pending') {
        query.paymentStatus = 'created';
      } else if (status === 'failed') {
        query.paymentStatus = 'failed';
      }
    }

    // Search filter
    if (search) {
      const donors = await Donor.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const donorIds = donors.map(d => d._id);

      query.$or = [
        { razorpay_order_id: { $regex: search, $options: 'i' } },
        { donor: { $in: donorIds } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get transactions
    const transactions = await Donation.find(query)
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('razorpay_order_id razorpay_payment_id amount paymentStatus paymentMethod createdAt paidAt receiptSent receiptSentAt taxCertificateIssued taxCertificateNumber taxCertificateIssuedAt donor');

    // Get total count
    const total = await Donation.countDocuments(query);

    // Format response
    const formattedTransactions = transactions.map(transaction => ({
      id: transaction._id,
      orderId: transaction.razorpay_order_id,
      paymentId: transaction.razorpay_payment_id,
      donorName: transaction.donor?.name || 'Anonymous',
      email: transaction.donor?.email || 'N/A',
      phone: transaction.donor?.phone || 'N/A',
      amount: transaction.amount / 100, // Convert paise to rupees
      status: transaction.paymentStatus === 'captured' ? 'verified' : transaction.paymentStatus,
      paymentMethod: transaction.paymentMethod,
      createdAt: transaction.createdAt,
      paidAt: transaction.paidAt,
      receiptSent: transaction.receiptSent || false,
      receiptSentAt: transaction.receiptSentAt || null,
      taxCertificateIssued: transaction.taxCertificateIssued || false,
      taxCertificateNumber: transaction.taxCertificateNumber || null,
      taxCertificateIssuedAt: transaction.taxCertificateIssuedAt || null
    }));

    res.json({
      success: true,
      transactions: formattedTransactions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
});


// Get All Donors
router.get('/donors', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const donors = await Donor.find(query)
      .sort({ lastDonationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Donor.countDocuments(query);

    res.json({
      success: true,
      donors: donors.map(d => ({
        id: d._id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        totalDonations: d.totalAmount / 100, // Convert paise to rupees
        donationCount: d.donationCount,
        lastDonation: d.lastDonationDate,
        status: 'active'
      })),
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    console.error('Donors error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donors' });
  }
});

// Get Donor Details with Donation History
router.get('/donors/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, message: 'Donor not found' });
    }

    const donations = await Donation.find({
      donor: donor._id,
      paymentStatus: 'captured'
    }).sort({ paidAt: -1 });

    res.json({
      success: true,
      donor: {
        id: donor._id,
        name: donor.name,
        email: donor.email,
        phone: donor.phone,
        address: donor.address,
        city: donor.city,
        state: donor.state,
        pincode: donor.pincode,
        pan: donor.pan,
        totalDonations: donor.totalAmount / 100, // Convert paise to rupees
        donationCount: donor.donationCount,
        lastDonation: donor.lastDonationDate
      },
      donations: donations.map(d => ({
        orderId: d.razorpay_order_id,
        amount: d.amount / 100, // Convert paise to rupees
        date: d.paidAt,
        purpose: d.purpose,
        certificateIssued: d.taxCertificateIssued
      }))
    });
  } catch (error) {
    console.error('Donor details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donor details' });
  }
});

router.get('/certificates/pending', async (req, res) => {
  try {
    // Get all verified donations (not just taxCertificateRequired)
    const pendingCertificates = await Donation.find({
      paymentStatus: 'captured'
    })
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 })
      .select('razorpay_order_id amount createdAt taxCertificateIssued taxCertificateNumber receiptSent donor');

    // Format the response
    const formattedCertificates = pendingCertificates.map(donation => ({
      id: donation._id,
      orderId: donation.razorpay_order_id,
      donorName: donation.donor?.name || 'Anonymous',
      email: donation.donor?.email || 'N/A',
      phone: donation.donor?.phone || 'N/A',
      amount: donation.amount / 100, // Convert paise to rupees
      taxCertificateIssued: donation.taxCertificateIssued || false,
      taxCertificateNumber: donation.taxCertificateNumber || null,
      receiptSent: donation.receiptSent || false,
      createdAt: donation.createdAt
    }));

    res.json({
      success: true,
      certificates: formattedCertificates,
      total: formattedCertificates.length
    });

  } catch (error) {
    console.error('Get pending certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending certificates'
    });
  }
});


// Payment Methods Breakdown
router.get('/reports/payment-methods', async (req, res) => {
  try {
    const breakdown = await Donation.aggregate([
      { $match: { paymentStatus: 'captured' } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          amount: { $sum: { $divide: ['$amount', 100] } } // Convert paise to rupees
        }
      }
    ]);

    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);

    res.json({
      success: true,
      breakdown: breakdown.map(item => ({
        method: item._id,
        count: item.count,
        amount: item.amount,
        percentage: total > 0 ? Math.round((item.amount / total) * 100) : 0
      }))
    });
  } catch (error) {
    console.error('Payment methods error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment methods' });
  }
});

// Donation Types Breakdown
router.get('/reports/donation-types', async (req, res) => {
  try {
    const breakdown = await Donation.aggregate([
      { $match: { paymentStatus: 'captured' } },
      {
        $group: {
          _id: '$donationType',
          count: { $sum: 1 },
          amount: { $sum: { $divide: ['$amount', 100] } } // Convert paise to rupees
        }
      }
    ]);

    res.json({
      success: true,
      breakdown: breakdown.map(item => ({
        type: item._id,
        count: item.count,
        amount: item.amount
      }))
    });
  } catch (error) {
    console.error('Donation types error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch donation types' });
  }
});

module.exports = router;
