const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const createInitialAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Administrator';
    if (!adminEmail || !adminPassword) {
      console.warn('ADMIN_EMAIL or ADMIN_PASSWORD missing. Admin user will not be seeded.');
      return;
    }

    const existing = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existing) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await User.create({ name: adminName, email: adminEmail.toLowerCase(), password: hashed });
      console.log('Initial admin user created.');
    }
  } catch (error) {
    console.error('Failed to create initial admin:', error.message);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    next(error);
  }
};

module.exports = { createInitialAdmin, login };
