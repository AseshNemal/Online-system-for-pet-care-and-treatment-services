const express = require('express');
const router = express.Router();
const ItemCategory = require('../model/ItemCategory');

//Add a new category
router.post('/add', async (req, res) => {
    try{
        const{ name, description } = req.body;
        const existingCategory = await ItemCategory.findOne({ name });
        if(existingCategory) {
            return res.status(400).json({ message: 'Category Already Exists'});
        }
        
        const newCategory = new ItemCategory({ name, description});
        await newCategory.save();

        res.status(201).json(newCategory);
    } catch(error){
        res.status(500).json({ message: error.message });
    }
});

//Get all categories
router.get('/all', async (req, res) => {
    try{
        const itemCategories = await ItemCategory.find();
        res.json(itemCategories);
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

//Get category by ID
router.get('/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const category = await ItemCategory.findById(id);

        if(!category){
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});

//Update category
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCategory = await ItemCategory.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCategory){
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});

//Delete a category
router.delete('/delete/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const deleteCategory = await ItemCategory.findByIdAndDelete(id);
        if(!deleteCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' })
    }catch(error){
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;