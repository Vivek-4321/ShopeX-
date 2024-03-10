const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        trim: true,
    }
});

module.exports = mongoose.model("Category", categorySchema);