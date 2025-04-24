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

module.exports = router;