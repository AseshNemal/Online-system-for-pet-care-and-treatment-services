const express = require('express');
//const { db } = require('../firebase');
import { db } from '../../utils/firebase';

const router = express.Router();

router.get('/pets', async (req, res) => {
  try {
    const snapshot = await db.collection('pets').get();
    const pets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
