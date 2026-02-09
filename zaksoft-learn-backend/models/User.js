const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  progress: [{
    formationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Formation' },
    completedChapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Formation.chapters' }]
  }]
});

module.exports = mongoose.model('User', userSchema);
