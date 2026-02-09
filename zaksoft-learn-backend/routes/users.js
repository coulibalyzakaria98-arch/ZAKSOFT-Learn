const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET user progress
router.get('/:firebaseUid/progress', async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
    res.json(user.progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST or UPDATE user progress
router.post('/:firebaseUid/progress', async (req, res) => {
  const { formationId, chapterId } = req.body;

  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (user == null) {
      // Create user if they don't exist
      const newUser = new User({
        firebaseUid: req.params.firebaseUid,
        email: req.body.email, // You'll need to send this from the frontend
        progress: [{
          formationId,
          completedChapters: [chapterId]
        }]
      });
      const savedUser = await newUser.save();
      return res.status(201).json(savedUser.progress);
    }

    const formationProgress = user.progress.find(p => p.formationId.equals(formationId));

    if (formationProgress) {
      // Formation progress exists, update completed chapters
      if (!formationProgress.completedChapters.includes(chapterId)) {
        formationProgress.completedChapters.push(chapterId);
      }
    } else {
      // No progress for this formation, create it
      user.progress.push({ formationId, completedChapters: [chapterId] });
    }

    await user.save();
    res.json(user.progress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
