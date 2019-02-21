const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    rollNumber: {
        type: String
    },
    mobile: {
        type: Number,
        required: true
    },
    authId: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    }]
})

const Users = mongoose.model('Users', userSchema)

module.exports = { Users }