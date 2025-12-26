import express from 'express';
import jwt from 'jsonwebtoken';
import Manager from '../models/Manager.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new manager
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const existingManager = await Manager.findByEmail(email);
    if (existingManager) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create manager
    const manager = await Manager.create({ email, password, name });

    // Generate JWT
    const token = jwt.sign(
      { managerId: manager.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      manager: {
        id: manager.id,
        email: manager.email,
        name: manager.name,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find manager
    const manager = await Manager.findByEmail(email);
    if (!manager) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await Manager.verifyPassword(password, manager.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { managerId: manager.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      manager: {
        id: manager.id,
        email: manager.email,
        name: manager.name,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current manager
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const manager = await Manager.findById(req.managerId);

    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    res.json({
      id: manager.id,
      email: manager.email,
      name: manager.name,
      settings: manager.settings,
    });
  } catch (error) {
    console.error('Get manager error:', error);
    res.status(500).json({ error: 'Failed to get manager info' });
  }
});

// Logout (client-side handles token removal, this is just a placeholder)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
