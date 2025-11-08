const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// ====== CLOUDINARY CONFIG ======
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Multer setup for post image upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ====== CREATE POST ======
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let imageUrl = null;

    if (req.file) {
      // Validate file type
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ msg: 'Only image files are allowed' });
      }

      const streamUpload = (reqFile) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'linkedin_clone_posts' },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(reqFile.buffer).pipe(stream);
        });
      };

      try {
        const result = await streamUpload(req.file);
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ msg: 'Image upload failed' });
      }
    }

    const newPost = new Post({
      user: user._id,
      text: req.body.text,
      image: imageUrl,
    });

    const post = await newPost.save();

    // Populate user and comments
    await post.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'comments.user', select: 'name avatar' },
    ]);

    res.json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).send('Server error');
  }
});

// ====== GET ALL POSTS ======
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name avatar')
      .populate('comments.user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).send('Server error');
  }
});

// ====== EDIT POST ======
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    post.text = req.body.text ?? post.text;
    await post.save();

    await post.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'comments.user', select: 'name avatar' },
    ]);

    res.json(post);
  } catch (err) {
    console.error('Edit post error:', err);
    res.status(500).send('Server error');
  }
});

// ====== DELETE POST ======
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized' });

    await post.deleteOne();
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).send('Server error');
  }
});

// ====== LIKE/UNLIKE ======
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const hasLiked = post.likes.some((l) => l.toString() === req.user.id);
    if (hasLiked) {
      post.likes = post.likes.filter((l) => l.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    await post.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'comments.user', select: 'name avatar' },
    ]);

    res.json(post);
  } catch (err) {
    console.error('Like/unlike post error:', err);
    res.status(500).send('Server error');
  }
});

// ====== ADD COMMENT ======
router.post('/comment/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.unshift({ user: req.user.id, text: req.body.text });
    await post.save();

    await post.populate([
      { path: 'user', select: 'name avatar' },
      { path: 'comments.user', select: 'name avatar' },
    ]);

    res.json(post);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
