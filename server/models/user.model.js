const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    address: {
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false
    }, 
    zipCode: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    secret: {
        type: String,
        required: false,
    },
    imgUrl: {
        type: String,
        required: false
    },
    resetToken: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('User', userSchema);