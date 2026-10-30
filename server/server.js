const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const registrationSchema = new mongoose.Schema({
  userType: { type: String, enum: ['client', 'driver'], required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true },
  address: String,
  postalCode: String,
  city: String,
  birthDate: String,
  licenseNumber: String,
  licenseExpiry: String,
  comments: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
registrationSchema.index({ email: 1 });
const Registration = mongoose.model('Registration', registrationSchema);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.get('/', (req, res) => res.json({ message: 'RuraLGo Backend' }));

app.post('/api/registration-requests', async (req, res) => {
  try {
    const { userType, name, email, phone, dni, address, postalCode, city, birthDate, licenseNumber, licenseExpiry, comments } = req.body;
    if (!userType || !name || !email || !phone) {
      return res.status(400).json({ message: 'Falten camps obligatoris' });
    }
    if (!['client', 'driver'].includes(userType)) {
      return res.status(400).json({ message: 'Tipus d’usuari no vàlid' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await Registration.findOne({ email: normalizedEmail, status: { $in: ['pending', 'approved'] } });
    if (existing) return res.status(409).json({ message: 'Aquest correu ja té una sol·licitud registrada' });

    const request = await Registration.create({
      userType, name, email: normalizedEmail, phone, dni, address, postalCode, city,
      birthDate, licenseNumber, licenseExpiry, comments
    });
    return res.status(201).json({
      message: 'Sol·licitud desada correctament',
      request: { id: request._id, email: request.email, status: request.status, createdAt: request.createdAt }
    });
  } catch (error) {
    console.error('Registration request error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut desar la sol·licitud' });
  }
});

app.get('/api/registration-requests', async (_req, res) => {
  try {
    const requests = await Registration.find().sort({ createdAt: -1 }).select('-__v');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'No s’han pogut carregar les sol·licituds' });
  }
});

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('⚠️ MongoDB connection failed:', err.message));
} else {
  console.error('⚠️ MONGODB_URI is not configured');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server started on port ${PORT}`));
