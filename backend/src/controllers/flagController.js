const FeatureFlag = require('../models/FeatureFlag');
const Organization = require('../models/Organization');

// ── Create Flag (Org Admin) ───────────────────────────────────────────────────
const createFlag = async (req, res) => {
  try {
    const { key, description } = req.body;
    if (!key || !key.trim())
      return res.status(400).json({ message: 'Feature key is required' });

    const organizationId = req.user.organizationId;

    const existing = await FeatureFlag.findOne({
      key: key.trim().toLowerCase(), organizationId,
    });
    if (existing)
      return res.status(400).json({ message: 'Feature key already exists for this organization' });

    const flag = await FeatureFlag.create({
      key: key.trim().toLowerCase(),
      description: description || '',
      isEnabled: false,
      organizationId,
      createdBy: req.user.userId,
    });

    res.status(201).json({ message: 'Feature flag created', flag });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Get All Flags for Org (Org Admin) ─────────────────────────────────────────
const getFlags = async (req, res) => {
  try {
    const flags = await FeatureFlag.find({ organizationId: req.user.organizationId })
      .sort({ createdAt: -1 });
    res.json({ flags });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Toggle / Update Flag (Org Admin) ─────────────────────────────────────────
const updateFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const { isEnabled, description } = req.body;

    const flag = await FeatureFlag.findOne({ _id: id, organizationId: req.user.organizationId });
    if (!flag)
      return res.status(404).json({ message: 'Feature flag not found' });

    if (typeof isEnabled === 'boolean') flag.isEnabled = isEnabled;
    if (description !== undefined) flag.description = description;
    flag.updatedAt = new Date();

    await flag.save();
    res.json({ message: 'Feature flag updated', flag });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Delete Flag (Org Admin) ───────────────────────────────────────────────────
const deleteFlag = async (req, res) => {
  try {
    const { id } = req.params;
    const flag = await FeatureFlag.findOneAndDelete({
      _id: id, organizationId: req.user.organizationId,
    });
    if (!flag)
      return res.status(404).json({ message: 'Feature flag not found' });

    res.json({ message: 'Feature flag deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Check Flag (Public — End User) ────────────────────────────────────────────
const checkFlag = async (req, res) => {
  try {
    const { orgName, key } = req.query;
    if (!orgName || !key)
      return res.status(400).json({ message: 'orgName and key are required' });

    const org = await Organization.findOne({ name: new RegExp(`^${orgName.trim()}$`, 'i') });
    if (!org)
      return res.status(404).json({ message: 'Organization not found' });

    const flag = await FeatureFlag.findOne({
      key: key.trim().toLowerCase(),
      organizationId: org._id,
    });

    if (!flag)
      return res.status(404).json({ message: 'Feature flag not found' });

    res.json({
      key: flag.key,
      isEnabled: flag.isEnabled,
      organization: org.name,
      status: flag.isEnabled ? 'ENABLED' : 'DISABLED',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createFlag, getFlags, updateFlag, deleteFlag, checkFlag };
