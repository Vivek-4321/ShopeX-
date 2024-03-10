const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: false
    },
    imageUrls: [
        {
            type: String,
            required: false
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    offer: {
        discountPercentage: { type: Number },
        endDate: { type: Date },
      },
    rating: {
        type: Number,
        required: false
    },
    no_rating: {
        type: Number,
        required: false,
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;