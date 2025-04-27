const express = require('express');
const router = express.Router();
const Expense = require('../model/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new expense
router.post('/', async (req, res) => {
  const expense = new Expense({
    itemName: req.body.itemName,
    quantity: req.body.quantity,
    costPerItem: req.body.costPerItem,
    totalCost: req.body.quantity * req.body.costPerItem
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    expense.itemName = req.body.itemName;
    expense.quantity = req.body.quantity;
    expense.costPerItem = req.body.costPerItem;
    expense.totalCost = req.body.quantity * req.body.costPerItem;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 