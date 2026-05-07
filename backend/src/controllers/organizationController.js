const Organization = require('../models/Organization');

// ── Create Organization (Super Admin) ─────────────────────────────────────────
const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim())
      return res.status(400).json({ message: 'Organization name is required' });

    const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    const existing = await Organization.findOne({ $or: [{ name: name.trim() }, { slug }] });
    if (existing)
      return res.status(400).json({ message: 'Organization name already exists' });

    const org = await Organization.create({ name: name.trim(), slug });
    res.status(201).json({ message: 'Organization created', organization: org });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── List All Organizations (Super Admin) ──────────────────────────────────────
const listOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.json({ organizations: orgs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── List Organizations Public (for signup dropdown) ───────────────────────────
const listOrganizationsPublic = async (req, res) => {
  try {
    const orgs = await Organization.find({}, 'name _id').sort({ name: 1 });
    res.json({ organizations: orgs });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createOrganization, listOrganizations, listOrganizationsPublic };
