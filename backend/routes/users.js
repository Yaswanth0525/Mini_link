const express = require('express');
const { body } = require('express-validator');
const { getUserProfile, updateProfile, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Profile picture must be a valid URL')
];

// Routes
router.get('/', getAllUsers);
router.get('/:userId', getUserProfile);
router.put('/profile', protect, validateUpdateProfile, updateProfile);

module.exports = router; 