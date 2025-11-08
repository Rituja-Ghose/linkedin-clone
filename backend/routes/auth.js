const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// ====== CLOUDINARY CONFIG ======
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup for profile picture upload
const storage = multer.memoryStorage(); // store in memory for Cloudinary
const upload = multer({ storage });

// ====== UPLOAD PROFILE PICTURE ======
router.post('/uploadProfilePic', auth, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    // Convert buffer to stream for Cloudinary
    const streamUpload = (reqFile) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'linkedin_clone_profiles' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(reqFile.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file);

    // Update user avatar in MongoDB
    const user = await User.findById(req.user.id);
    user.avatar = result.secure_url;
    await user.save();

    res.json({ msg: 'Profile picture updated', url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ====== REGISTER ======
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    user = new User({ name, email, passwordHash });
    await user.save();

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ====== LOGIN ======
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
