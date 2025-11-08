require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

// ====== CORS CONFIG ======
const allowedOrigins = [
  'http://localhost:5173',        // Vite dev server
  process.env.FRONTEND_URL        // Vercel frontend from .env
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ====== PARSE JSON ======
app.use(express.json());

// ====== CLOUDINARY CONFIG ======
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ====== MONGODB CONNECT ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// ====== ROUTES ======
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// ====== DEFAULT ROUTE ======
app.get('/', (req, res) => res.send('LinkedIn Clone API'));

// ====== START SERVER ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
