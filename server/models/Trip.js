const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  serviceType: {
    type: String,
    enum: ['transport', 'cultura', 'familia', 'salut', 'comunitaris', 'natura', 'urgencia'],
    default: 'transport'
  },
  pickupLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  dropoffLocation: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  estimatedDistance: Number, // en km
  estimatedDuration: Number, // en minutos
  estimatedPrice: Number, // en euros
  actualPrice: {
    type: Number,
    default: null
  },
  rating: {
    passenger: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    driver: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  startedAt: Date,
  completedAt: Date
});

module.exports = mongoose.model('Trip', tripSchema);
