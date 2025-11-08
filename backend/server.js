require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ====== CLOUDINARY CONFIG ======
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);


app.get('/', (req, res) => res.send('LinkedIn Clone API'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
