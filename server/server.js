const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/', (req, res) => {
  res.json({ message: 'RuraLGo Backend' });
});


// Conectar MongoDB de forma asincrónica en background (sin esperar)
if (process.env.MONGODB_URI) {
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
  }).then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.log('⚠️ MongoDB connection failed:', err.message));
}

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
