const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Local authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email']
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login'
  }),
  authController.googleCallback
);

module.exports = router;