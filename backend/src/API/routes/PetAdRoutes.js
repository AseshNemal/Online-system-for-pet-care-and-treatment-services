const express = require("express");
const router = express.Router();
const PetAd = require("../model/PetAd");

// Middleware to authenticate users (example, assuming JWT)
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).send({ error: "Authentication required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    if (!req.user) {
      return res.status(401).send({ error: "User not found" });
    }
    next();
  } catch (error) {
    res.status(401).send({ error: "Invalid token" });
  }
};

// User: Submit a new pet ad
router.post("/submit", async (req, res) => {
  try {
    const { image, type, breed, weight, description, contactNumber } = req.body;

    if (!image || !type || !breed || !weight || !description || !contactNumber) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Validate weight
    if (weight <= 0) {
      return res.status(400).send({ error: "Weight must be greater than 0" });
    }
    if (weight > 200) {
      return res.status(400).send({ error: "Weight cannot exceed 200 kg" });
    }

    // Validate phone number (basic regex for 10-12 digits)
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
      // Associate ad with authenticated user
    });
 

    await petAd.save();
    res.status(201).send({ message: "Ad submitted successfully, awaiting approval" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// User: Get ad by ID for editing
router.get("/edit/:id", authMiddleware, async (req, res) => {
  try {
    const ad = await PetAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).send({ error: "Ad not found" });
    }
    // Verify user owns the ad
    if (ad.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: "Unauthorized to edit this ad" });
    }
    res.status(200).json(ad);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// User: Update ad
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { image, type, breed, weight, description, contactNumber } = req.body;

    // Validate inputs
    if (!image || !type || !breed || !weight || !description || !contactNumber) {
      return res.status(400).send({ error: "All fields are required" });
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

    const ad = await PetAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).send({ error: "Ad not found" });
    }

    // Verify user owns the ad
    if (ad.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: "Unauthorized to edit this ad" });
    }

    // Update ad fields
    ad.image = image;
    ad.type = type;
    ad.breed = breed;
    ad.weight = weight;
    ad.description = description;
    ad.contactNumber = contactNumber;
    ad.status = "Pending"; // Reset to pending for re-approval
    ad.rejectionReason = null; // Clear any previous rejection reason
    ad.updatedAt = Date.now();

    await ad.save();
    res.status(200).send({ message: "Ad updated successfully, awaiting approval", ad });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// User: Get my ads
router.get("/my-ads", authMiddleware, async (req, res) => {
  try {
    const ads = await PetAd.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// User: Get approved ads for portal
router.get("/approved", async (req, res) => {
  try {
    const ads = await PetAd.find({ status: "Approved" }).sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Admin: Get all ads by status
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

// Admin: Approve ad
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

// Admin: Reject ad
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

// Admin: Delete ad
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

// Admin: Delete approved ad
router.delete("/admin/approved/delete/:id", async (req, res) => {
  try {
    const { deletionReason } = req.body;
    if (!deletionReason) {
      return res.status(400).send({ error: "Deletion reason is required" });
    }
    const ad = await PetAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).send({ error: "Ad not found" });
    }
    if (ad.status !== "Approved") {
      return res.status(400).send({ error: "Ad is not in approved state" });
    }
    ad.status = "Deleted";
    ad.rejectionReason = deletionReason;
    await ad.save();
    res.status(200).send({ message: "Approved ad deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Admin: Edit approved ad
router.put("/admin/approved/edit/:id", async (req, res) => {
  try {
    const { image, type, breed, weight, description, contactNumber } = req.body;

    if (!image || !type || !breed || !weight || !description || !contactNumber) {
      return res.status(400).send({ error: "All fields are required" });
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

    const ad = await PetAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).send({ error: "Ad not found" });
    }
    if (ad.status !== "Approved") {
      return res.status(400).send({ error: "Ad is not in approved state" });
    }

    ad.image = image;
    ad.type = type;
    ad.breed = breed;
    ad.weight = weight;
    ad.description = description;
    ad.contactNumber = contactNumber;
    ad.updatedAt = Date.now();

    await ad.save();
    res.status(200).send({ message: "Approved ad updated successfully", ad });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;