const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ItemCategory', required: true },
    stock: { type: Number, required: true },
    images: [{ type: String }], // Array of image URLs
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;