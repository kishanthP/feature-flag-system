const { Schema, model } = require('mongoose');

const featureFlagSchema = new Schema({
  key: { type: String, required: true, trim: true, lowercase: true },
  description: { type: String, trim: true, default: '' },
  isEnabled: { type: Boolean, default: false },
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Unique flag key per organization
featureFlagSchema.index({ key: 1, organizationId: 1 }, { unique: true });

module.exports = model('FeatureFlag', featureFlagSchema);
