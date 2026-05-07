const { Schema, model } = require('mongoose');

const organizationSchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('Organization', organizationSchema);
