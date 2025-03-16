const mongoose = require('mongoose');

const itemCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
}, { timestamps: true });

const ItemCategory = mongoose.model('ItemCategory', itemCategorySchema);

export default ItemCategory;