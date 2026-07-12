const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const router = express.Router();

// ===== RATE LIMITING =====
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Too many registration attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper to verify Firebase / Google ID Token
const verifyFirebaseToken = async (idToken) => {
  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid token structure.');
  }

  const kid = decoded.header.kid;
  const iss = decoded.payload && decoded.payload.iss;
  console.log('Token header:', decoded.header);
  console.log('Token payload:', decoded.payload);

  let certUrl = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
  let isGoogleObj = false;

  if (iss === 'https://accounts.google.com' || iss === 'accounts.google.com') {
    certUrl = 'https://www.googleapis.com/oauth2/v1/certs';
    isGoogleObj = true;
  }

  const res = await fetch(certUrl);
  const certs = await res.json();
  console.log('Available cert kids:', Object.keys(certs));
  const cert = certs[kid];

  if (!cert) {
    throw new Error(`Invalid signature key. Token kid: ${kid}`);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || 'innsightai123';
  if (isGoogleObj) {
    return jwt.verify(idToken, cert, {
      algorithms: ['RS256'],
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
    });
  } else {
    return jwt.verify(idToken, cert, {
      algorithms: ['RS256'],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
    });
  }
};

// ===== INPUT VALIDATION =====
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const googleSchema = Joi.object({
  idToken: Joi.string().required(),
});

// ===== REGISTER =====
// POST /api/auth/register
router.post('/register', registerLimiter, async (req, res) => {
  try {
    // Validate input
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { name, email, password } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({ name, email, password: hashedPassword });

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== LOGIN =====
// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== GOOGLE OAUTH (Firebase) =====
// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { error } = googleSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { idToken } = req.body;
    const payload = await verifyFirebaseToken(idToken);
    const { email, name } = payload;

    if (!email) return res.status(401).json({ success: false, message: 'Invalid Google token.' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        provider: 'google',
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Google login successful.',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Google verification failed:', err);
    res.status(401).json({ success: false, message: 'Invalid or expired Google token.' });
  }
});

// ===== GET CURRENT USER (protected) =====
// GET /api/auth/me
const requireAuth = require('../middleware/auth');
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
