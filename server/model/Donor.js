const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  pan: {
    type: String,
    uppercase: true,
    sparse: true
  },
  
  // ADD ADDRESS FIELDS
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pincode: {
    type: String,
    trim: true
  },
  
  // Donation History Summary
  totalDonations: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0  // in paise
  },
  lastDonationDate: Date,
  donationCount: {
    type: Number,
    default: 0
  },
  
  // Preferences
  emailOptIn: {
    type: Boolean,
    default: true
  },
  taxCertificatePreference: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donor', donorSchema);