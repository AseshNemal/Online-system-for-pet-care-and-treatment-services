const express = require('express');
const router = express.Router();
const Product = require('../model/Product');
const ItemCategory = require('../model/ItemCategory');

//Add New Product
router.post('/add', async (req, res) => {
    try {
        const { name, description, price, category, stock, images } = req.body;
        const categoryExists = await ItemCategory.findById(category);
        if (!categoryExists) {
            return res.status(404).json({ message: 'Invalid category ID' });
        }

        const newProduct = new Product({ name, description, price, category, stock, images });
        await newProduct.save();
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Update a product
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) 
            return res.status(404).json({ message: 'Product not found' });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Delete a product
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) 
            return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all products
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id).populate('category');
        if (!product) 
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
