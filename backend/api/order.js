import { connect } from "../src/utils/database.connection.js";
import Order from "../src/API/model/Order.js";

export default async function handler(req, res) {
  await connect();

  const { method, url, body } = req;
  const path = url.split('?')[0];

  try {
    switch (method) {
      case "POST":
        if (path === "/api/order/create") {
          const { userId, items, totalAmount } = body;
          const order = new Order({ userId, items, totalAmount });
          await order.save();
          return res.status(201).json({ message: "Order created", order });
        }
        return res.status(400).json({ error: "Invalid POST request" });

      case "GET":
        if (path.startsWith("/api/order/user/")) {
          const userId = path.split("/").pop();
          const orders = await Order.find({ userId }).sort({ createdAt: -1 });
          return res.status(200).json(orders);
        } else if (path === "/api/order/all") {
          const orders = await Order.find().sort({ createdAt: -1 });
          return res.status(200).json(orders);
        }
        return res.status(400).json({ error: "Invalid GET request" });

      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
