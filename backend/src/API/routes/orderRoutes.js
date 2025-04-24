const express = require("express");
const Order = require("../model/Order");
const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    const order = new Order({ userId, items, totalAmount });
    await order.save();
    res.status(201).json({ message: "Order created", order });
  } catch (err) {
    res.status(500).json({ message: "Order creation failed", error: err });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});

// Get all orders
router.get('/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // newest first
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
});



module.exports = router;