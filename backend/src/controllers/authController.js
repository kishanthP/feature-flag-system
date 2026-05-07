const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── Super Admin Login ──────────────────────────────────────────────────────────
const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    if (
      email !== process.env.SUPER_ADMIN_EMAIL ||
      password !== process.env.SUPER_ADMIN_PASSWORD
    ) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ role: 'super_admin', email });
    res.json({ token, user: { email, role: 'super_admin', name: 'Super Admin' } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Admin Signup ───────────────────────────────────────────────────────────────
const adminSignup = async (req, res) => {
  try {
    const { name, email, password, organizationId } = req.body;
    if (!name || !email || !password || !organizationId)
      return res.status(400).json({ message: 'All fields are required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    const org = await Organization.findById(organizationId);
    if (!org)
      return res.status(400).json({ message: 'Organization not found' });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name, email, password: hashed, role: 'org_admin', organizationId,
    });

    const token = generateToken({
      userId: user._id, role: user.role,
      organizationId: user.organizationId, name: user.name,
    });

    res.status(201).json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        role: user.role, organizationId, organizationName: org.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Admin Login ────────────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email, role: 'org_admin' }).populate('organizationId', 'name');
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({
      userId: user._id, role: user.role,
      organizationId: user.organizationId._id, name: user.name,
    });

    res.json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        role: user.role,
        organizationId: user.organizationId._id,
        organizationName: user.organizationId.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { superAdminLogin, adminSignup, adminLogin };
