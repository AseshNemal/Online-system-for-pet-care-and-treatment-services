const express = require('express');
const router = express.Router();
const multer = require('multer')
const Product = require('../model/Product');

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save images to 'uploads' folder
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + "-" + file.originalname;
        console.log("Saving file:", filename); // Log the filename
        cb(null, filename);
    }
});

const upload = multer({ storage });

//Add New Product
router.post('/add', upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, category, stock, restockLevel, restockAmount } = req.body;
        const image = req.file ? req.file.path : "";

        const newProduct = new Product({ name, description, price, category, stock, restockLevel, restockAmount, image });
        await newProduct.save();
        res.status(200).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Update a product
router.put('/update/:id', upload.single("image"), async (req, res) => {
    try {
        const { name, description, price, category, stock, restockLevel, restockAmount } = req.body;
        const image = req.file ? req.file.path : undefined;

        const updateData = {
            name,
            description,
            price,
            category,
            stock,
            restockLevel,
            restockAmount
        };

        if (image) {
            updateData.image = image;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
});

//Restock a Product if Needed
router.put('/restock/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock <= product.restockLevel) {
            product.stock += product.restockAmount;
            await product.save();
            return res.json({ message: "Product restocked", product });
        }

        res.json({ message: "Restock not required", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Reduce Stock and Trigger Restock if Needed
router.put('/reduce-stock/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Not enough stock available" });
        }

        product.stock -= quantity;

        // If stock falls at or below the restock level, auto-restock
        if (product.stock <= product.restockLevel) {
            product.stock += product.restockAmount;
        }

        await product.save();
        res.json({ message: "Stock updated", product });
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
        const products = await Product.find();
        
        const updatedProducts = products.map(prod => ({
            ...prod._doc,
            image: prod.image ? prod.image.replace(/\\/g, "/") : ""  // Convert \ to /
        }));
        res.json(updatedProducts);
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

router.get("/by-category", async (req, res) => {
    try {
        const { categoryId } = req.query;

        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        // Validate if category exists
        const categoryExists = await ItemCategory.findById(categoryId);
        if (!categoryExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Fetch products by category ID
        const products = await Product.find({ category: categoryId });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;