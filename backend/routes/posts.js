const express = require('express');
const { body } = require('express-validator');
const { 
  createPost, 
  getAllPosts, 
  getPost, 
  updatePost, 
  deletePost, 
  getPostsByUser 
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validatePost = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Post content must be between 1 and 1000 characters')
];

// Routes
router.get('/', optionalAuth, getAllPosts);
router.get('/:postId', optionalAuth, getPost);
router.get('/user/:userId', optionalAuth, getPostsByUser);

// Protected routes
router.post('/', protect, validatePost, createPost);
router.put('/:postId', protect, validatePost, updatePost);
router.delete('/:postId', protect, deletePost);

module.exports = router; 