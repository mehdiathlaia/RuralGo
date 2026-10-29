const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    default: null
  },
  type: {
    type: String,
    enum: ['trip_request', 'trip_accepted', 'trip_started', 'trip_completed', 'trip_cancelled', 'message'],
    required: true
  },
  title: String,
  message: String,
  isRead: {
    type: Boolean,
    default: false
  },
  data: mongoose.Schema.Types.Mixed, // Datos adicionales
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
