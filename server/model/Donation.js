const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  // Razorpay Details
  razorpay_order_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  razorpay_payment_id: {
    type: String,
    default: null,
    index: true
  },
  razorpay_signature: {
    type: String,
    default: null
  },
  // purpose of donation
  purpose:{
    type:String,
  },
  // Donation Details
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  donationType: {
    type: String,
    enum: ['one-time', 'monthly'],
    default: 'one-time'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'other'],
    default: 'card'
  },
  
  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['created', 'pending', 'captured', 'failed', 'refunded'],
    default: 'created',
    index: true
  },
  
  // REFERENCE TO DONOR MODEL
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donor',
    required: false,
    index: true,
    default:null
  },
  
  // Snapshot of donor info at time of donation (for record keeping)
  donorSnapshot: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  
  // Tax Certificate
  taxCertificateRequired: {
    type: Boolean,
    default: false
  },
  taxCertificateIssued: {
    type: Boolean,
    default: false
  },
  taxCertificateNumber: {
    type: String,
    sparse: true,
    unique: true
  },
  
  // Receipt Details
  receiptSent: {
    type: Boolean,
    default: false
  },
  receiptSentAt: {
    type: Date
  },
  
  // Metadata
  notes: {
    type: Map,
    of: String
  },
  
  // Timestamps
  paidAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ paymentStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Donation', donationSchema);
