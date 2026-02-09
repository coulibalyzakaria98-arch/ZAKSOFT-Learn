const express = require('express');
const router = express.Router();
const Formation = require('../models/Formation');

// GET all formations
router.get('/', async (req, res) => {
  try {
    const formations = await Formation.find();
    res.json(formations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific formation
router.get('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id);
    if (formation == null) {
      return res.status(404).json({ message: 'Cannot find formation' });
    }
    res.json(formation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new formation (admin only)
router.post('/', async (req, res) => {
  const formation = new Formation({
    title: req.body.title,
    description: req.body.description,
    chapters: req.body.chapters
  });

  try {
    const newFormation = await formation.save();
    res.status(201).json(newFormation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
