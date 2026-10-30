const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const registrationSchema = new mongoose.Schema({
  userType: { type: String, enum: ['client', 'driver'], required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true },
  dni: String,
  healthCard: String,
  emergencyContact: String,
  emergencyPhone: String,
  vehicleType: String,
  insurance: String,
  rejectionReason: String,
  reviewedAt: Date,
  reviewedBy: String,
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

function requireAdmin(req, res, next) {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    if (!token || !process.env.JWT_SECRET) return res.status(401).json({ message: 'Acceso de administrador requerido' });
    const session = jwt.verify(token, process.env.JWT_SECRET);
    if (session.role !== 'admin') return res.status(403).json({ message: 'Acceso restringido' });
    req.adminEmail = session.email;
    next();
  } catch (error) { return res.status(401).json({ message: 'Sesión inválida o caducada' }); }
}

app.post('/api/auth/login', async (req, res) => {
  try {
    const email = String((req.body || {}).email || '').trim().toLowerCase();
    const password = String((req.body || {}).password || '');
    if (!email || !password) return res.status(400).json({ message: 'Correu i contrasenya obligatoris' });
    const user = await User.findOne({ email });
    if (!user || !user.isActive || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Correu o contrasenya incorrectes' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, rating: user.rating } });
  } catch (error) {
    console.error('User login error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut iniciar sessió' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const email = String((req.body || {}).email || '').trim().toLowerCase();
  const password = String((req.body || {}).password || '');
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) return res.status(503).json({ message: 'Configura ADMIN_EMAIL, ADMIN_PASSWORD y JWT_SECRET en Render' });
  if (email !== process.env.ADMIN_EMAIL.trim().toLowerCase() || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
  const token = jwt.sign({ role: 'admin', email: process.env.ADMIN_EMAIL }, process.env.JWT_SECRET, { expiresIn: '8h' });
  return res.json({ token, email: process.env.ADMIN_EMAIL });
});

const createMailer = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
};

async function sendDecisionEmail(to, subject, text) {
  const mailer = createMailer();
  if (!mailer) return false;
  await mailer.sendMail({ from: process.env.SMTP_FROM, to, subject, text });
  return true;
}

app.patch('/api/registration-requests/:id', requireAdmin, async (req, res) => {
  try {
    const status = (req.body || {}).status;
    const reason = String((req.body || {}).rejectionReason || '').trim();
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Estado no vàlid' });
    if (status === 'rejected' && !reason) return res.status(400).json({ message: 'Cal indicar el motiu del rebuig' });

    const request = await Registration.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Sol·licitud no trobada' });
    if (request.status !== 'pending') return res.status(409).json({ message: 'Aquesta sol·licitud ja ha estat revisada' });

    let emailSent = false;
    let accountCreated = false;
    let temporaryPassword = '';

    if (status === 'approved') {
      const existingUser = await User.findOne({ email: request.email });
      if (existingUser) return res.status(409).json({ message: 'Ja existeix un compte amb aquest correu' });
      temporaryPassword = crypto.randomBytes(9).toString('base64url') + 'A1!';
      const user = new User({
        name: request.name,
        email: request.email,
        password: temporaryPassword,
        phone: request.phone,
        role: request.userType === 'driver' ? 'driver' : 'passenger'
      });
      await user.save();
      accountCreated = true;
      try {
        emailSent = await sendDecisionEmail(
          request.email,
          'RURAL-GO: sol·licitud aprovada',
          `Hola ${request.name},\n\nLa teva sol·licitud ha estat aprovada. Ja pots iniciar sessió amb:\nCorreu: ${request.email}\nContrasenya temporal: ${temporaryPassword}\n\nCanvia la contrasenya tan aviat com sigui possible.\n\nEquip RURAL-GO`
        );
      } catch (mailError) {
        console.error('Approval email failed:', mailError.message);
      }
    } else {
      try {
        emailSent = await sendDecisionEmail(
          request.email,
          'RURAL-GO: resolució de la sol·licitud',
          `Hola ${request.name},\n\nLa teva sol·licitud no ha estat aprovada. Motiu: ${reason}\n\nSi necessites més informació, contacta amb l'equip de RURAL-GO.`
        );
      } catch (mailError) {
        console.error('Rejection email failed:', mailError.message);
      }
    }

    request.status = status;
    request.reviewedAt = new Date();
    request.reviewedBy = req.adminEmail;
    if (status === 'rejected') request.rejectionReason = reason;
    await request.save();

    return res.json({
      message: status === 'approved' ? 'Sol·licitud aprovada i compte creat' : 'Sol·licitud rebutjada',
      request,
      accountCreated,
      emailSent
    });
  } catch (error) {
    console.error('Registration review error:', error.message);
    return res.status(500).json({ message: 'No s’ha pogut processar la sol·licitud' });
  }
});

app.post('/api/registration-requests', async (req, res) => {
  try {
    const { userType, name, email, phone, dni, address, postalCode, city, birthDate, licenseNumber, licenseExpiry, comments, healthCard, emergencyContact, emergencyPhone, vehicleType, insurance } = req.body;
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
      birthDate, licenseNumber, licenseExpiry, comments, healthCard, emergencyContact, emergencyPhone, vehicleType, insurance
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

app.get('/api/registration-requests', requireAdmin, async (_req, res) => {
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
