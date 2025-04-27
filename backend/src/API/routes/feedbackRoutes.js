const express = require("express");
const Feedback = require("../model/Feedback");
const router = express.Router();

// POST: Submit Feedback
router.post("/add", async (req, res) => {
  try {
    const { userId, userName, feedback, rating } = req.body;
    const newFeedback = new Feedback({ userId, userName, feedback, rating });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Get all Feedbacks
router.get("/all", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Delete a feedback
router.delete("/delete/:id", async (req, res) => {
    try {
      const feedback = await Feedback.findById(req.params.id);
      if (!feedback) {
        return res.status(404).json({ error: "Feedback not found." });
      }
  
      await feedback.deleteOne();
      res.json({ message: "Feedback deleted successfully." });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete feedback." });
    }
  });
  
  // Update a feedback
  router.put("/edit/:id", async (req, res) => {
    const { feedback, rating } = req.body;
  
    try {
      const updatedFeedback = await Feedback.findByIdAndUpdate(
        req.params.id,
        { feedback, rating },
        { new: true }
      );
  
      if (!updatedFeedback) {
        return res.status(404).json({ error: "Feedback not found." });
      }
  
      res.json(updatedFeedback);
    } catch (err) {
      res.status(500).json({ error: "Failed to update feedback." });
    }
  });

module.exports = router;
