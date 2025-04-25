const express = require("express");
const router = express.Router();
const PetAd = require("../model/PetAd");

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({ error: "Unauthorized: Please log in" });
  }
  next();
};

router.post("/submit", isAuthenticated, async (req, res) => {
  try {
    const { image, type, breed, weight, description, contactNumber, userId } = req.body;

    if (userId !== req.session.user._id) {
      return res.status(403).send({ error: "Forbidden: User ID does not match session" });
    }

    if (!image || !type || !breed || !weight || !description || !contactNumber || !userId) {
      return res.status(400).send({ error: "All fields are required, including userId" });
    }

    if (weight <= 0) {
      return res.status(400).send({ error: "Weight must be greater than 0" });
    }
    if (weight > 200) {
      return res.status(400).send({ error: "Weight cannot exceed 200 kg" });
    }

    const phoneRegex = /^\d{10,12}$/;
    if (!phoneRegex.test(contactNumber)) {
      return res.status(400).send({ error: "Contact number must be 10-12 digits" });
    }

    const petAd = new PetAd({
      image,
      type,
      breed,
      weight,
      description,
      contactNumber,
      userId,
    });

    await petAd.save();
    res.status(201).send({ message: "Ad submitted successfully, awaiting approval" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/approved", async (req, res) => {
  try {
    const ads = await PetAd.find({ status: "Approved" }).sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/admin/list", async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const ads = await PetAd.find(query).sort({ updatedAt: -1 });
    const count = await PetAd.countDocuments(query);
    res.status(200).json({ ads, count });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/admin/approve/:id", async (req, res) => {
  try {
    const ad = await PetAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).send({ error: "Ad not found" });
    }
    ad.status = "Approved";
    ad.rejectionReason = null;
    await ad.save();
    res.status(200).send({ message: "Ad approved successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/admin/reject/:id", async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason) {
      return res.status(400).send({ error: "Rejection reason is required" });
    }
    const ad = await PetAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).send({ error: "Ad not found" });
    }
    ad.status = "Rejected";
    ad.rejectionReason = rejectionReason;
    await ad.save();
    res.status(200).send({ message: "Ad rejected successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/admin/delete/:id", async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    if (!rejectionReason) {
      return res.status(400).send({ error: "Deletion reason is required" });
    }
    const ad = await PetAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).send({ error: "Ad not found" });
    }
    ad.status = "Deleted";
    ad.rejectionReason = rejectionReason;
    await ad.save();
    res.status(200).send({ message: "Ad deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

module.exports = router;