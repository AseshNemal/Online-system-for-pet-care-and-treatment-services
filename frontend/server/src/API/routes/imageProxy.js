import express from "express";
import axios from "axios";

const router = express.Router();

// Proxy route to fetch and serve profile images
router.get("/profile-image", async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", response.headers["content-type"]);
    response.data.pipe(res);
  } catch (error) {
    console.error("Error proxying image:", error.message, error.response?.status, error.response?.data);
    res.status(500).json({ error: "Failed to fetch image" });
  }
});

export default router;
