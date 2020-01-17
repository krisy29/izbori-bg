const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'User'
    },
    members: [{
        name: {
            type: String
        }
    }],
    votes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Party = mongoose.model('Party', partySchema);

module.exports = Party;