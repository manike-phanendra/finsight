const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Category = require('../models/Category');

const generateToken = (userId, email, name) => {
  const secret = process.env.JWT_SECRET || 'finsight_quantora_secret_key_2026';
  return jwt.sign({ id: userId, email, name }, secret, { expiresIn: '7d' });
};

// Seed default categories for a new user
const seedDefaultCategories = async (userId) => {
  const defaultCategories = [
    { name: 'Salary', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Investments', type: 'income' },
    { name: 'Other Income', type: 'income' },
    { name: 'Food & Dining', type: 'expense' },
    { name: 'Rent & Housing', type: 'expense' },
    { name: 'Utilities', type: 'expense' },
    { name: 'Transportation', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
    { name: 'Healthcare', type: 'expense' },
    { name: 'Shopping', type: 'expense' },
    { name: 'Education', type: 'expense' },
    { name: 'Personal Care', type: 'expense' },
    { name: 'Miscellaneous', type: 'expense' },
  ];

  try {
    const categoriesToInsert = defaultCategories.map(cat => ({
      userId,
      name: cat.name,
      type: cat.type,
    }));
    await Category.insertMany(categoriesToInsert, { ordered: false });
  } catch (err) {
    // Ignore duplicate key errors if already seeded
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Seed default categories for this user
    await seedDefaultCategories(user._id);

    const token = generateToken(user._id, user.email, user.name);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.', error: error.message });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user._id, user.email, user.name);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user profile.' });
  }
};
