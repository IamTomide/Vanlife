const mongoose = require('mongoose');

const vanSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, 'id is a required field'],
        unique: true
    },
    name: {
        type: String,
        required: [true, 'name is a required field']
    },
    image: {
        type: String,
        required: [true, 'image is a required field']
    },
    status: {
        type: String,
        required: [true, 'Status is a required field']
    },
    description: {
        type: String,
        required: [true, 'Status is a required field']
    },
    price: {
        type: Number,
        get: v => (v/100).toFixed(2),
        set: v => v*100,
        required: [true, 'Price is a required field']
    }
}, {timestamps: true, toJSON: {getters: true}});

const Van = mongoose.model('Van', vanSchema);

module.exports = Van;

