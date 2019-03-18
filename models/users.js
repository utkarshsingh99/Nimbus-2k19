const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        default: ""
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
        type: String,
        default: ""
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events'
    }],
    branch: {
        type: String,
        default: ""
    },
    year: {
        type: String,
        default: ""
    },
    profilePicture : {
      type : String,
      default : ""
    }
})

const Users = mongoose.model('Users', userSchema)

module.exports = { Users }
