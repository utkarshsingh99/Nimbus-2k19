const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true
    },
    firebase_id: {
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