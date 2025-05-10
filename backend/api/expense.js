import { connect } from "../src/utils/database.connection.js";
import Expense from "../src/API/model/Expense.js";

export default async function handler(req, res) {
  await connect();

  const { method, url, body } = req;
  const path = url.split('?')[0];

  try {
    switch (method) {
      case "GET":
        if (path === "/api/expense/") {
          const expenses = await Expense.find().sort({ createdAt: -1 });
          return res.status(200).json(expenses);
        }
        return res.status(400).json({ error: "Invalid GET request" });

      case "POST":
        if (path === "/api/expense/") {
          const expense = new Expense({
            itemName: body.itemName,
            quantity: body.quantity,
            costPerItem: body.costPerItem,
            totalCost: body.quantity * body.costPerItem
          });
          const newExpense = await expense.save();
          return res.status(201).json(newExpense);
        }
        return res.status(400).json({ error: "Invalid POST request" });

      case "PUT":
        if (path.startsWith("/api/expense/")) {
          const id = path.split("/").pop();
          const expense = await Expense.findById(id);
          if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
          }
          expense.itemName = body.itemName;
          expense.quantity = body.quantity;
          expense.costPerItem = body.costPerItem;
          expense.totalCost = body.quantity * body.costPerItem;
          const updatedExpense = await expense.save();
          return res.status(200).json(updatedExpense);
        }
        return res.status(400).json({ error: "Invalid PUT request" });

      case "DELETE":
        if (path.startsWith("/api/expense/")) {
          const id = path.split("/").pop();
          const expense = await Expense.findById(id);
          if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
          }
          await expense.deleteOne();
          return res.status(200).json({ message: "Expense deleted" });
        }
        return res.status(400).json({ error: "Invalid DELETE request" });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
}
